type User = {
  id: string;
};

const getUser = async (): Promise<null | User> => {
  try {
    const res = await fetch("http://localhost:3000/user/login", {
      method: "GET",
      credentials: "include",
    });

    const resData = await res.json();
    console.log(resData);

    if (resData.error) {
      console.log(resData.error);
      return null;
    } else {
      return resData.user;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
};

export { getUser };
