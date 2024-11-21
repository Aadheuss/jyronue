import { Link, useNavigate } from "react-router-dom";
import styles from "./Reply.module.css";
import { CommentValue, ReplyValue } from "../../config/typeValues";
import { FC, useContext, useRef } from "react";
import LikeButton from "../LikeButton/LikeButton";
import { unescapeInput } from "../../utils/htmlDecoder";
import ReplyBox from "../ReplyBox/ReplyBox";
import { UserContext } from "../../context/context";
import avatar from "../../assets/images/avatar_icon.svg";
import ReplyButton from "../ReplyButton/ReplyButton";

interface Props {
  comment: CommentValue;
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
  updateComment: ({ updatedComment }: { updatedComment: CommentValue }) => void;
  openReplyId: string;
  setOpenReplyId: React.Dispatch<React.SetStateAction<string>>;
}

const Reply: FC<Props> = ({
  comment,
  reply,
  updateLikesBox,
  updateComment,
  openReplyId,
  setOpenReplyId,
}) => {
  const { user } = useContext(UserContext);
  const replyInputRef = useRef<null | HTMLInputElement>(null);
  const navigate = useNavigate();

  const openReplyForm = ({ id }: { id: string }) => {
    setOpenReplyId(id);
  };

  return (
    <li className={styles.reply} key={reply.id}>
      <Link to={`/profile/${reply.author.username}`}>
        <img
          className={styles.replyUserProfile}
          src={reply.author.profileImage.pictureUrl || avatar}
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
            <ReplyButton
              size="SMALL"
              onClick={() => {
                if (user === false) {
                  navigate("/login");
                }
                openReplyForm({ id: reply.id });
              }}
            />
          </div>
        </div>
        {reply.likesBox._count.likes > 0 && (
          <p className={styles.likeCountText}>
            <span> {reply.likesBox._count.likes}</span>{" "}
            {reply.likesBox._count.likes < 2 ? "like" : "likes"}
          </p>
        )}
        {openReplyId === reply.id && (
          <ReplyBox
            replyToUsername={reply.author.username}
            replyToId={reply.authorId}
            commentId={comment.id}
            comment={comment}
            parentId={reply.id}
            replyInputRef={replyInputRef}
            updateComment={updateComment}
          />
        )}
      </div>
    </li>
  );
};

export default Reply;
