import { Link } from "react-router-dom";
import styles from "./Reply.module.css";
import { ReplyValue } from "../../config/typeValues";
import { FC } from "react";
import LikeButton from "../LikeButton/LikeButton";
import { unescapeInput } from "../../utils/htmlDecoder";

interface Props {
  reply: ReplyValue;
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

const Reply: FC<Props> = ({ reply, updateLikesBox }) => {
  return (
    <li className={styles.reply} key={reply.id}>
      <Link to={`/profile/${reply.author.username}`}>
        <img
          className={styles.replyUserProfile}
          src={reply.author.profileImage.pictureUrl}
        ></img>
      </Link>

      <div className={styles.mainReply}>
        <div className={styles.replyProfileInfo}>
          <Link
            to={`/profile/${reply.author.username}`}
            className={styles.replyDisplayName}
          >
            {reply.author.displayName}
          </Link>

          <Link
            to={`/profile/${reply.author.username}`}
            className={styles.replyUsername}
          >
            {`@${reply.author.username}`}
          </Link>
        </div>
        <Link
          to={`/profile/${reply.replyTo.username}`}
          className={styles.replyText}
        >
          <span
            className={styles.replyTo}
          >{`@${reply.replyTo.username} `}</span>
          {unescapeInput(reply.content)}
        </Link>
        <div className={styles.interactionInfo}>
          <div className={styles.interactionButtons}>
            <LikeButton
              id={reply.id}
              type="reply"
              likesBox={reply.likesBox}
              likesBoxId={reply.likesBox.id}
              updateLikesBox={updateLikesBox}
              size="SMALL"
              userLikeStatus={reply.userLikeStatus}
            />
            <button className={styles.replyButton}></button>
          </div>
        </div>
        {reply.likesBox._count.likes > 0 && (
          <p className={styles.likeCountText}>
            <span> {reply.likesBox._count.likes}</span>{" "}
            {reply.likesBox._count.likes < 2 ? "like" : "likes"}
          </p>
        )}
      </div>
    </li>
  );
};

export default Reply;
