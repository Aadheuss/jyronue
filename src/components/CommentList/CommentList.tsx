import React, { FC, useEffect, useState } from "react";
import styles from "./CommentList.module.css";
import { useParams } from "react-router-dom";
import CommentBox from "../CommentBox/CommentBox";
import { CommentValue } from "../../config/typeValues";
import Comment from "../Comment/Comment";

interface Props {
  commentInputRef: React.MutableRefObject<null | HTMLInputElement>;
}

const CommentList: FC<Props> = ({ commentInputRef }) => {
  const { postid } = useParams();
  const [comments, setComments] = useState<CommentValue[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/post/${postid}/comments?limit=100`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const resData = await res.json();

        if (resData.error) {
          console.log(resData.error);
        } else {
          console.log(resData);
          setComments(resData.comments);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchComments();
  }, [postid]);

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
    if (comments) {
      const selectedComment = comments.find(
        (comment) => comment.likesBox.id === likesBox.id
      );
      const changedComment = { ...selectedComment, likesBox, userLikeStatus };
      const updatedComment = comments.map((comment) => {
        return comment.id === changedComment.id ? changedComment : comment;
      }) as CommentValue[];

      setComments([...updatedComment]);
    }
  };

  const updateComments = ({ comment }: { comment: CommentValue }) => {
    setComments([comment, ...comments]);
    console.log(comments);
  };

  return (
    <ul className={styles.comments}>
      <CommentBox
        updateComments={updateComments}
        commentInputRef={commentInputRef}
      />
      <p className={styles.commentHeading}>Comments</p>
      <div className={styles.commentList}>
        {comments && comments.length > 0 ? (
          comments.map((comment) => {
            return (
              <Comment comment={comment} updateLikesBox={updateLikesBox} />
            );
          })
        ) : (
          <li className={styles.comment} key="no-comment-list">
            <p className={styles.commentText}>No comments yet</p>
          </li>
        )}
      </div>
    </ul>
  );
};

export default CommentList;
