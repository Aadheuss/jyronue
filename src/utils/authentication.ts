const domain = import.meta.env.VITE_DOMAIN;

type User = {
  id: string;
};

const getUser = async (): Promise<null | User> => {
  try {
    const res = await fetch(`${domain}/user/login`, {
      method: "GET",
      credentials: "include",
    });

    const resData = await res.json();

    if (resData.error) {
      console.log("Done checking authentication: " + resData.error);
      return null;
    } else {
      console.log("Done checking authentication: You are logged in");
      return resData.user;
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
