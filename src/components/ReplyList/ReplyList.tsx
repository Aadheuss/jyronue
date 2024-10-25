import { FC, useEffect } from "react";
import styles from "./ReplyList.module.css";
import { CommentValue, ReplyValue } from "../../config/typeValues";
import Reply from "../Reply/Reply";

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
  const { replies } = comment;

  useEffect(() => {
    const fetchReplies = async () => {
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
          console.log(resData);

          if (resData.error) {
            console.log(resData.error);
          } else {
            console.log(resData);
            const updatedComment = { ...comment, replies: resData.replies };
            console.log(updatedComment);
            updateComment({ updatedComment });
          }
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchReplies();

    return () => {};
  }, [comment, replies, updateComment, view]);

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
            <div className={styles.replyList}>
              {replies &&
                replies.length > 0 &&
                replies.map((reply) => (
                  <Reply
                    updateLikesBox={updateLikesBox}
                    reply={reply}
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
