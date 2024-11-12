import "./App.css";
import { Outlet } from "react-router-dom";
import { getUser } from "./utils/authentication";
import { useState, useEffect } from "react";
import { UserContext } from "./context/context";
import { fetchData } from "./utils/fetchFunctions";
import { UserValue } from "./config/typeValues";

function App() {
  const [user, setUser] = useState<null | UserValue | false>(null);

  useEffect(() => {
    const configureUserState = async () => {
      try {
        const user = await getUser();

        if (user) {
          const userData = await fetchData({
            link: `http://localhost:3000/user/profile?id=${user.id}`,
            options: {
              method: "GET",
              credentials: "include",
            },
          });

          if (userData?.isError) {
            console.error(userData.data.error, userData.data.error);
          } else {
            setUser(userData?.data.profile);
          }
        } else {
          setUser(false);
        }
      } catch (err) {
        console.error(err);
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
