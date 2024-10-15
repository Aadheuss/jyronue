import { createContext } from "react";

type User = {
  id: string;
};

type UserContextValue = {
  user: null | User;
  setUser: React.Dispatch<React.SetStateAction<null | User>>;
};

const UserContext = createContext<UserContextValue>({
  user: null,
  setUser: () => {},
});

export { UserContext };
