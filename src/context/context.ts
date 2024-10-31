import { createContext } from "react";

type User = {
  id: string;
};

type UserContextValue = {
  user: null | User | false;
  setUser: React.Dispatch<React.SetStateAction<null | User | false>>;
};

const UserContext = createContext<UserContextValue>({
  user: null,
  setUser: () => {},
});

export { UserContext };
