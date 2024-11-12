import { FC, useContext } from "react";
import styles from "./LikeBox.module.css";
import { UserContext } from "../../context/context";
import { fetchLikesBox, fetchToggleLike } from "../../utils/fetchFunctions";
import { useNavigate } from "react-router-dom";

interface Props {
  // The id of the thing to like
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
    userLikeStatus,
  }: {
    likesBox: {
      id: string;
      _count: {
        likes: number;
      };
    };
    userLikeStatus: boolean;
  }) => void;
  size?: "SMALL" | "REGULAR";
  userLikeStatus: boolean;
}

const LikeButton: FC<Props> = ({
  id,
  type,
  likesBox,
  likesBoxId,
  userLikeStatus,
  updateLikesBox,
  size,
}) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

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
    const toggle = userLikeStatus ? "unlike" : "like";
    const toggleLikeData = await fetchToggleLike({
      id,
      type,
      toggle,
      formData,
    });

    if (!toggleLikeData.errors || !toggleLikeData.errors) {
      const likesBoxData = await fetchLikesBox({ id, type, likesBoxId });
      if (!likesBoxData.error || !likesBoxData.errors) {
        const likesBox = likesBoxData.likesBox;
        updateLikesBox({
          likesBox,
          userLikeStatus: !userLikeStatus,
        });
      }
    }
  };

  return (
    <button
      aria-label={`like ${type ? type : ""}`}
      data-like={likesBox && likesBox.id}
      className={
        user
          ? userLikeStatus
            ? size === "SMALL"
              ? styles.likedSmall
              : styles.liked
            : size === "SMALL"
            ? styles.likeSmall
            : styles.like
          : size === "SMALL"
          ? styles.likeSmall
          : styles.like
      }
      onMouseDown={(e) => {
        e.preventDefault();
      }}
      onClick={(e) => {
        e.preventDefault();

        if (user) {
          if (id && likesBoxId) {
            toggleLike({
              id,
              type,
              likesBoxId,
            });
          }
        } else {
          navigate("/login");
        }
      }}
    ></button>
  );
};

export default LikeButton;
