import "./App.css";
import { Outlet } from "react-router-dom";
import { getUser } from "./utils/authentication";
import { useState, useEffect } from "react";
import { UserContext } from "./context/context";
import { fetchData } from "./utils/fetchFunctions";
import { UserValue } from "./config/typeValues";
const domain = import.meta.env.VITE_DOMAIN;

function App() {
  const [user, setUser] = useState<null | UserValue | false>(null);

  useEffect(() => {
    const configureUserState = async () => {
      const user = await getUser();

      if (user) {
        try {
          const userData = await fetchData({
            link: `${domain}/user/profile?id=${user.id}`,
            options: {
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
          if (err instanceof TypeError) console.error(err.message);
        }
      } else {
        setUser(false);
      }
    };

    configureUserState();
  }, []);

  return (
    <>
      <UserContext.Provider value={{ user, setUser }}>
        <Outlet />
      </UserContext.Provider>
    </>
  );
}

export default App;
