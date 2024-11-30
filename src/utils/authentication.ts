const domain = import.meta.env.VITE_DOMAIN;

type User = {
  id: string;
};

const getUser = async (): Promise<null | User | false> => {
  try {
    const login = await fetch(`${domain}/user/login`, {
      mode: "cors",
      method: "GET",
      credentials: "include",
    });

    const loginData = await login.json();

    if (loginData.error) {
      console.log(`${loginData.error.message}: Authentication`);
      return null;
    } else {
      console.log(`${loginData.message}`);
      return loginData.user;
    }
  } catch (err) {
    console.log("Something went wrong! Failed to authenticate");
    if (err instanceof TypeError) {
      console.log(err.message + ": Authentication");
    }

    return null;
  }
};

export { getUser };
