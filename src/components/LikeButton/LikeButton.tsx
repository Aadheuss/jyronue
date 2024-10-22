import { FC, useContext, useEffect, useState } from "react";
import styles from "./LikeBox.module.css";
import { UserContext } from "../../context/context";
import { fetchLikesBox, fetchToggleLike } from "../../utils/fetchFunctions";

interface Props {
  id: string | undefined;
  type: "post" | "comment" | "reply";
  likesBox: {
    id: string;
    _count: {
      likes: number;
    };
  } | null;
  likesBoxId: string | null;
  updateLikesBox: ({
    likesBox,
  }: {
    likesBox: {
      id: string;
      _count: {
        likes: number;
      };
    };
  }) => void;
  size?: "SMALL" | "REGULAR";
}

const LikeButton: FC<Props> = ({
  id,
  type,
  likesBox,
  likesBoxId,
  updateLikesBox,
  size,
}) => {
  const { user } = useContext(UserContext);
  const [likeStatus, setLikeStatus] = useState<boolean>(false);

  useEffect(() => {
    const fecthUserLikeStatus = async () => {
      if (user && likesBoxId) {
        try {
          const res = await fetch(
            `http://localhost:3000/${type}/${id}/likesbox/${likesBoxId}/status`,
            {
              method: "GET",
              credentials: "include",
            }
          );

          const resData = await res.json();

          console.log(resData);

          if (resData.error | resData.errors) {
            console.error(resData.error, resData.errors);
          } else {
            setLikeStatus(resData.userLikeStatus);
          }
        } catch (err) {
          console.error(err);
        }
      }
    };

    fecthUserLikeStatus();

    return () => {
      setLikeStatus(false);
    };
  }, [id, likesBoxId, user, type]);

  const toggleLike = async ({
    id,
    type,
    likesBoxId,
  }: {
    id: string;
    type: "post" | "comment" | "reply";
    likesBoxId: string;
  }) => {
    const formData = new URLSearchParams();
    formData.append("type", type);
    formData.append("likesboxid", likesBoxId);

    const toggle = likeStatus ? "unlike" : "like";
    const toggleLikeData = await fetchToggleLike({
      id,
      type,
      toggle,
      formData,
    });

    if (toggleLikeData && (!toggleLikeData.errors || !toggleLikeData.errors)) {
      const likesBoxData = await fetchLikesBox({ id, type, likesBoxId });
      if (likesBoxData && (!likesBoxData.error || likesBoxData.errors)) {
        const likesBox = likesBoxData.likesBox;
        updateLikesBox({ likesBox });
        const currentLikeStatus = !likeStatus;
        setLikeStatus(currentLikeStatus);
      }
    }
  };

  return (
    <button
      data-like={likesBox && likesBox.id}
      className={
        user
          ? likeStatus
            ? size === "SMALL"
              ? styles.likedSmall
              : styles.liked
            : size === "SMALL"
            ? styles.likeSmall
            : styles.like
          : styles.like
      }
      onClick={() => {
        if (likesBox && id && likesBox.id) {
          toggleLike({
            id,
            type,
            likesBoxId: likesBox.id,
          });
        }
      }}
    ></button>
  );
};

export default LikeButton;
