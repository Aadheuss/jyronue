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
      console.error(resData.error);
      return null;
    } else {
      return resData.user;
    }
  } catch (err) {
    console.error(err);
    return null;
  }
};

export { getUser };
