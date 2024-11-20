import { FC, useEffect, useState } from "react";
import styles from "./ReplyList.module.css";
import { CommentValue, ReplyValue } from "../../config/typeValues";
import Reply from "../Reply/Reply";
import Loader from "../Loader/Loader";

interface Props {
  comment: CommentValue;
  replyCount: number;
  updateComment: ({ updatedComment }: { updatedComment: CommentValue }) => void;
  view: boolean;
  setView: React.Dispatch<React.SetStateAction<boolean>>;
}

const ReplyList: FC<Props> = ({
  comment,
  replyCount,
  updateComment,
  view,
  setView,
}) => {
  const [openReplyId, setOpenReplyId] = useState<string>("");

  useEffect(() => {
    const fetchReplies = async () => {
      const replies = comment.replies;

      if (!replies && view) {
        try {
          const res = await fetch(
            `http://localhost:3000/comment/${comment.id}/replies`,
            {
              method: "GET",
              credentials: "include",
            }
          );

          const resData = await res.json();

          if (resData.error) {
            console.error(resData.error);
          } else {
            const updatedComment = { ...comment, replies: resData.replies };

            updateComment({ updatedComment });
          }
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchReplies();

    return () => {};
  }, [view, comment, updateComment]);

  const updateLikesBox = ({
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
  }) => {
    const replies = comment.replies;

    if (replies) {
      const selectedReply = replies.find(
        (reply) => reply.likesBox.id === likesBox.id
      );
      const changedReply = { ...selectedReply, likesBox, userLikeStatus };
      const updatedreplies = replies.map((reply) => {
        return reply.id === changedReply.id ? changedReply : reply;
      }) as ReplyValue[];

      const updatedComment = { ...comment, replies: updatedreplies };
      updateComment({ updatedComment });
    }
  };

  return (
    <>
      {view ? (
        <>
          <ul className={styles.replies}>
            {!comment.replies && (
              <div className={styles.loaderContainer}>
                <Loader
                  type="spinner"
                  size={{ width: "1em", height: "1em" }}
                  color="var(--accent-color-1)"
                />
              </div>
            )}
            <div className={styles.replyList}>
              {comment.replies &&
                comment.replies.length > 0 &&
                comment.replies.map((reply) => (
                  <Reply
                    comment={comment}
                    reply={reply}
                    updateLikesBox={updateLikesBox}
                    openReplyId={openReplyId}
                    setOpenReplyId={setOpenReplyId}
                    updateComment={updateComment}
                    key={reply.id}
                  />
                ))}
            </div>
          </ul>
          <button
            className={styles.showReplyButton}
            onClick={() => setView(false)}
          >
            Hide replies
          </button>
        </>
      ) : (
        <button
          className={styles.showReplyButton}
          onClick={() => {
            setView(true);
          }}
        >
          view replies ({replyCount})
        </button>
      )}
    </>
  );
};

export default ReplyList;
