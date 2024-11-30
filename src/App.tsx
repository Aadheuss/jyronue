import "./App.css";
import { Outlet } from "react-router-dom";
import { getUser } from "./utils/authentication";
import { useState, useEffect } from "react";
import { UserContext } from "./context/context";
import { UserValue } from "./config/typeValues";
import { RefetchUserContext } from "./context/context";
const domain = import.meta.env.VITE_DOMAIN;

function App() {
  const [user, setUser] = useState<null | UserValue | false>(null);
  const [refetchUser, setRefetchUser] = useState(false);

  useEffect(() => {
    const configureUserState = async () => {
      // Get user login status
      /* The backend will return a user object with an id if the user is authenticated 
      or false if the user is not */
      const user = await getUser();

      // Fetch user profile if user is authenticated
      if (user) {
        try {
          const profile = await fetch(`${domain}/user/profile?id=${user.id}`, {
            mode: "cors",
            method: "GET",
            credentials: "include",
          });

          const profileData = await profile.json();

          if (profileData.error) {
            console.log(`${profileData.error.message}: App profile`);
          } else {
            console.log("Successfully fetched user profile data");
            setUser(profileData.profile);
          }
        } catch (err) {
          console.log(
            "Something went wrong! failed to fetch user profile data"
          );
          if (err instanceof TypeError)
            console.log(err.message + ": App user authentication");
        }
      } else {
        setUser(user);
      }
    };

    if (user === null) {
      configureUserState();
    }

    if (refetchUser) {
      setRefetchUser(false);
    }
  }, [user, refetchUser]);

  return (
    <>
      <UserContext.Provider value={{ user, setUser }}>
        <RefetchUserContext.Provider value={{ refetchUser, setRefetchUser }}>
          <Outlet />
        </RefetchUserContext.Provider>
      </UserContext.Provider>
    </>
  );
}

export default App;
