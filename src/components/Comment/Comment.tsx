import { Link, useNavigate } from "react-router-dom";
import styles from "./Comment.module.css";
import { CommentValue } from "../../config/typeValues";
import { FC, useContext, useRef, useState } from "react";
import LikeButton from "../LikeButton/LikeButton";
import { unescapeInput } from "../../utils/htmlDecoder";
import ReplyList from "../ReplyList/ReplyList";
import ReplyBox from "../ReplyBox/ReplyBox";
import { UserContext } from "../../context/context";
import avatar from "../../assets/images/avatar_icon.svg";
import ReplyButton from "../ReplyButton/ReplyButton";

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
  openReplyId: string;
  setOpenReplyId: React.Dispatch<React.SetStateAction<string>>;
  updateComment: ({ updatedComment }: { updatedComment: CommentValue }) => void;
}

const Comment: FC<Props> = ({
  comment,
  openReplyId,
  setOpenReplyId,
  updateLikesBox,
  updateComment,
}) => {
  const { user } = useContext(UserContext);
  const [view, setView] = useState(false);
  const replyInputRef = useRef<null | HTMLInputElement>(null);
  const navigate = useNavigate();

  const openReplyForm = ({ id }: { id: string }) => {
    setOpenReplyId(id);
  };

  return (
    <li className={styles.comment}>
      <Link to={`/profile/${comment.author.username}`}>
        <img
          className={styles.commentUserProfile}
          src={comment.author.profileImage.pictureUrl || avatar}
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
            <ReplyButton
              size="SMALL"
              onClick={() => {
                if (user === false) {
                  navigate("/login");
                }

                openReplyForm({ id: comment.id });
              }}
            />
          </div>
        </div>
        {comment.likesBox._count.likes > 0 && (
          <p className={styles.likeCountText}>
            <span> {comment.likesBox._count.likes}</span>{" "}
            {comment.likesBox._count.likes < 2 ? "like" : "likes"}
          </p>
        )}
        {openReplyId === comment.id && (
          <ReplyBox
            replyToUsername={comment.author.username}
            replyToId={comment.authorId}
            commentId={comment.id}
            comment={comment}
            replyInputRef={replyInputRef}
            updateComment={updateComment}
            view={view}
            setView={setView}
          />
        )}

        {comment._count.replies > 0 && (
          <ReplyList
            comment={comment}
            replyCount={comment._count.replies}
            updateComment={updateComment}
            view={view}
            setView={setView}
          />
        )}
      </div>
    </li>
  );
};

export default Comment;
