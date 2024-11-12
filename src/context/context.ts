import { createContext } from "react";
import { UserValue } from "../config/typeValues";

type UserContextValue = {
  user: null | UserValue | false;
  setUser: React.Dispatch<React.SetStateAction<null | UserValue | false>>;
};

const UserContext = createContext<UserContextValue>({
  user: null,
  setUser: () => {},
});

export { UserContext };
