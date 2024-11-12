import { FC, useState } from "react";
import { PostValue } from "../../config/typeValues";
import styles from "./PostItem.module.css";
import Slideshow from "../Slideshow/Slideshow";
import { Link, useNavigate } from "react-router-dom";
import LikeButton from "../LikeButton/LikeButton";
import { unescapeInput } from "../../utils/htmlDecoder";

interface Props {
  post: PostValue;
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
}

const PostItem: FC<Props> = ({ post, updateLikesBox }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const sliceString = (string: string, limit: number): string => {
    const slicedString = string.slice(0, limit);

    return string.length > limit ? slicedString + "..." : string;
  };
  return (
    <li className={styles.list}>
      <article className={styles.postItem}>
        <div className={styles.profileContainer}>
          <Link to={`/profile/${post.author.username}`}>
            <img
              className={styles.avatar}
              src={post.author.profileImage.pictureUrl}
            />
          </Link>
          <div className={styles.profileNames}>
            <Link
              to={`/profile/${post.author.username}`}
              className={styles.displayName}
            >
              {post.author.displayName}
            </Link>
            <Link
              to={`/profile/${post.author.username}`}
              className={styles.username}
            >
              {post.author.username}
            </Link>
          </div>
          <div />
        </div>
        <Slideshow images={post.content} />
        <div>
          <div className={styles.infoBox}>
            <div className={styles.interactionButtons}>
              <LikeButton
                id={post.id}
                type={"post"}
                likesBox={post.likesBox}
                likesBoxId={post.likesBox.id}
                updateLikesBox={updateLikesBox}
                size="REGULAR"
                userLikeStatus={post.userLikeStatus}
              />
              <button
                className={styles.reply}
                onClick={() => {
                  navigate(`/post/${post.id}`);
                }}
              ></button>
            </div>
            <div className={styles.countBox}>
              <p className={styles.countText}>
                <span className={styles.count}>
                  {post.likesBox._count.likes}
                </span>
                {post.likesBox._count.likes > 1 ? " likes" : " like"}
              </p>
              <p className={styles.countText}>
                <span className={styles.count}>{post._count.comments}</span>
                {post._count.comments > 1 ? " comments" : " comment"}
              </p>
            </div>
          </div>
          <p className={styles.caption}>
            {isOpen
              ? unescapeInput(post.caption)
              : sliceString(unescapeInput(post.caption), 128)}
            {!isOpen && post.caption.length > 128 && (
              <button
                className={styles.seeMoreButton}
                type="button"
                onClick={() => setIsOpen(!isOpen)}
              >
                See more
              </button>
            )}
          </p>
        </div>
      </article>
    </li>
  );
};

export default PostItem;
