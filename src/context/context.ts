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

type RefetchUserContextValue = {
  refetchUser: boolean;
  setRefetchUser: React.Dispatch<React.SetStateAction<boolean>>;
};

const RefetchUserContext = createContext<RefetchUserContextValue>({
  refetchUser: false,
  setRefetchUser: () => {},
});

export { UserContext, RefetchUserContext };
