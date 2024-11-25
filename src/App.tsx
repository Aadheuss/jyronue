import "./App.css";
import { Outlet } from "react-router-dom";
import { getUser } from "./utils/authentication";
import { useState, useEffect } from "react";
import { UserContext } from "./context/context";
import { fetchData } from "./utils/fetchFunctions";
import { UserValue } from "./config/typeValues";
import { RefetchUserContext } from "./context/context";
const domain = import.meta.env.VITE_DOMAIN;

function App() {
  const [user, setUser] = useState<null | UserValue | false>(null);
  const [refetchUser, setRefetchUser] = useState(false);

  useEffect(() => {
    const configureUserState = async () => {
      const user = await getUser();

      if (user) {
        try {
          const userData = await fetchData({
            link: `${domain}/user/profile?id=${user.id}`,
            options: {
              mode: "cors",
              method: "GET",
              credentials: "include",
            },
          });

          if (userData?.isError) {
            if (userData.data.error)
              console.log(
                `Failed to fetch user profile data: ${userData.data.error}`
              );

            if (userData?.data.errors) {
              console.log(userData?.data.errors);
            }
          } else {
            console.log("Successfully fetched user profile data");
            setUser(userData?.data.profile);
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
