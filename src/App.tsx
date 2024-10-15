import "./App.css";
import { Outlet } from "react-router-dom";
import { getUser } from "./utils/authentication";
import { useState, useEffect } from "react";
import { UserContext } from "./context/context";

type User = {
  id: string;
};

function App() {
  const [user, setUser] = useState<null | User>(null);

  useEffect(() => {
    const configureUserState = async () => {
      const user = await getUser();

      if (user) {
        setUser(user);
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
