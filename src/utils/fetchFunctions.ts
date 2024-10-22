const fetchLikesBox = async ({
  postId,
  likesBoxId,
}: {
  postId: string;
  likesBoxId: string;
}) => {
  try {
    const res = await fetch(
      `http://localhost:3000/post/${postId}/likesbox/${likesBoxId}`,
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
  postId,
  toggle,
  formData,
}: {
  postId: string;
  toggle: "like" | "unlike";
  formData: URLSearchParams;
}) => {
  try {
    const res = await fetch(`http://localhost:3000/post/${postId}/${toggle}`, {
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

export { fetchLikesBox, fetchToggleLike };
