import { Link } from "react-router-dom";
import styles from "./Comment.module.css";
import { CommentValue } from "../../config/typeValues";
import { FC } from "react";
import LikeButton from "../LikeButton/LikeButton";
import { unescapeInput } from "../../utils/htmlDecoder";
import ReplyList from "../ReplyList/ReplyList";

interface Props {
  comment: CommentValue;
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

const Comment: FC<Props> = ({ comment, updateLikesBox }) => {
  return (
    <li className={styles.comment} key={comment.id}>
      <Link to={`/profile/${comment.author.username}`}>
        <img
          className={styles.commentUserProfile}
          src={comment.author.profileImage.pictureUrl}
        ></img>
      </Link>

      <div className={styles.mainComment}>
        <div className={styles.commentProfileInfo}>
          <Link
            to={`/profile/${comment.author.username}`}
            className={styles.commentDisplayName}
          >
            {comment.author.displayName}
          </Link>

          <Link
            to={`/profile/${comment.author.username}`}
            className={styles.commentUsername}
          >
            {`@${comment.author.username}`}
          </Link>
        </div>
        <p className={styles.commentText}>{unescapeInput(comment.content)}</p>
        <div className={styles.interactionInfo}>
          <div className={styles.interactionButtons}>
            <LikeButton
              id={comment.id}
              type="comment"
              likesBox={comment.likesBox}
              likesBoxId={comment.likesBox.id}
              updateLikesBox={updateLikesBox}
              size="SMALL"
              userLikeStatus={comment.userLikeStatus}
            />
            <button className={styles.reply}></button>
          </div>
        </div>
        {comment.likesBox._count.likes > 0 && (
          <p className={styles.likeCountText}>
            <span> {comment.likesBox._count.likes}</span>{" "}
            {comment.likesBox._count.likes < 2 ? "like" : "likes"}
          </p>
        )}

        {comment._count.replies > 0 && (
          <ReplyList
            commentId={comment.id}
            replyCount={comment._count.replies}
          />
        )}
      </div>
    </li>
  );
};

export default Comment;
