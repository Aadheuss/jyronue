import { FC, useContext } from "react";
import styles from "./LikeBox.module.css";
import { UserContext } from "../../context/context";
import { useNavigate } from "react-router-dom";
const domain = import.meta.env.VITE_DOMAIN;

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

    try {
      const toggleLike = await fetch(`${domain}/${type}/${id}/${toggle}`, {
        mode: "cors",
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const toggleLikeData = await toggleLike.json();

      if (toggleLikeData.error) {
        console.log(
          `${toggleLikeData.error.message}: ${toggleLikeData.error.error} : Toggle Like`
        );

        // Handle validation error
        if (toggleLikeData.error.errors) {
          const errorList = toggleLikeData.error.errors;
          errorList.forEach(
            (error: { field: string; value: string; msg: string }) =>
              console.log(error.msg)
          );
        }
      } else {
        // Fetch updated likesBox
        const likesBox = await fetch(
          `${domain}/${type}/${id}/likesbox/${likesBoxId}`,
          {
            mode: "cors",
            method: "GET",
            credentials: "include",
          }
        );
        const likesBoxData = await likesBox.json();

        if (likesBoxData.error) {
          console.log(`${likesBoxData.error.message}: Likes Box Data`);
        } else {
          console.log(`Successfully ${toggle}d the ${type}`);
          updateLikesBox({
            likesBox: likesBoxData.likesBox,
            userLikeStatus: !userLikeStatus,
          });
        }
      }
    } catch (err) {
      console.log("Something went wrong: Like button");
      if (err instanceof TypeError) console.log(err.message);
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
