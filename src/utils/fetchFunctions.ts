const fetchLikesBox = async ({
  id,
  type,
  likesBoxId,
}: {
  id: string;
  type: "post" | "comment" | "reply";
  likesBoxId: string;
}) => {
  try {
    const res = await fetch(
      `http://localhost:3000/${type}/${id}/likesbox/${likesBoxId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const resData = await res.json();

    return resData;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const fetchToggleLike = async ({
  id,
  type,
  toggle,
  formData,
}: {
  id: string;
  type: "post" | "comment" | "reply";
  toggle: "like" | "unlike";
  formData: URLSearchParams;
}) => {
  try {
    const res = await fetch(`http://localhost:3000/${type}/${id}/${toggle}`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const resData = await res.json();

    return resData;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const fetchData = async ({
  link,
  options,
}: {
  link: string;
  options: {
    method: "GET" | "POST";
    credentials?: "include";
    body?: FormData | URLSearchParams;
  };
}) => {
  try {
    const res = await fetch(link, options);
    const status = res.status;
    const data = await res.json();
    const isError = data.error || data.errors;

    return {
      status,
      data,
      isError,
    };
  } catch (err) {
    console.error(err);
  }
};

export { fetchLikesBox, fetchToggleLike, fetchData };
