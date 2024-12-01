import React, { FC, useContext, useEffect, useRef, useState } from "react";
import styles from "./CommentList.module.css";
import { useParams } from "react-router-dom";
import CommentBox from "../CommentBox/CommentBox";
import { CommentValue } from "../../config/typeValues";
import Comment from "../Comment/Comment";
import { UserContext } from "../../context/context";
import Loader from "../Loader/Loader";
const domain = import.meta.env.VITE_DOMAIN;

interface Props {
  commentInputRef: React.MutableRefObject<null | HTMLInputElement>;
}

const CommentList: FC<Props> = ({ commentInputRef }) => {
  const { user } = useContext(UserContext);
  const { postid } = useParams();
  const [comments, setComments] = useState<CommentValue[]>([]);
  const [openReplyId, setOpenReplyId] = useState<string>("");
  const [cursor, setCursor] = useState<null | false | string>(null);
  const [isScrollLoading, setIsScrollLoading] = useState<boolean>(false);
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchComments = async ({
      cursor,
    }: {
      cursor: null | false | string;
    }) => {
      const cursorQuery = cursor ? `&cursor=${cursor}` : "";
      const limit = 3;

      if (cursor !== null) {
        setIsScrollLoading(true);
      }

      try {
        const commentsList = await fetch(
          `${domain}/post/${postid}/comments?limit=${limit}${cursorQuery}`,
          {
            mode: "cors",
            method: "GET",
            credentials: "include",
          }
        );

        const commentsListData = await commentsList.json();

        if (commentsListData.error) {
          console.log(`${commentsListData.error.message}: Comment List `);

          // Handle validation error
          if (commentsListData.error.errors) {
            const errorList = commentsListData.error.errors;

            errorList.map(
              (error: { field: string; value: string; msg: string }) =>
                console.log(error.msg)
            );
          }
        } else {
          const nextCursor =
            commentsListData.comments.length >= limit
              ? commentsListData.nextCursor
              : false;
          setCursor(nextCursor);
          setComments(
            comments
              ? [...comments, ...(commentsListData.comments || [])]
              : commentsListData.comments
          );
        }
      } catch (err) {
        console.log("Something went wrong!: Comment List");
        if (err instanceof TypeError) console.log(err.message);
      } finally {
        setIsScrollLoading(false);
      }
    };

    const current = observerRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Fetch new data if only another fetch hasn't started
          if (!isScrollLoading) {
            // Only fetch if not the initial fetch or false cursor
            if (cursor !== null && cursor !== false) {
              console.log("Fecthing new data");
              fetchComments({ cursor });
            }
          }
        }
      },
      {
        threshold: 1,
      }
    );

    if (current) {
      observer.observe(current);
    }

    if (cursor === null) {
      // initial fetch
      fetchComments({ cursor });
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [postid, cursor, comments, isScrollLoading]);

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

  const updateComment = ({
    updatedComment,
  }: {
    updatedComment: CommentValue;
  }) => {
    const updatedComments = comments.map((comment) =>
      comment.id === updatedComment.id ? updatedComment : comment
    );
    setComments([...updatedComments]);
  };

  return (
    <div className={styles.comments}>
      {user && (
        <CommentBox
          updateComments={updateComments}
          commentInputRef={commentInputRef}
        />
      )}

      <p className={styles.commentHeading}>Comments</p>
      <ul className={styles.commentList}>
        {comments && comments.length > 0 && (
          <>
            {comments.map((comment) => {
              return (
                <Comment
                  key={comment.id}
                  comment={comment}
                  updateLikesBox={updateLikesBox}
                  openReplyId={openReplyId}
                  setOpenReplyId={setOpenReplyId}
                  updateComment={updateComment}
                />
              );
            })}
          </>
        )}
        <div
          className={cursor === null ? styles.loaderContainer : styles.hidden}
        >
          <Loader
            type="spinner"
            size={{ width: "1.5em", height: "1.5em" }}
            color="var(--accent-color-3)"
          />
        </div>
        <div
          className={isScrollLoading ? styles.loaderContainer : styles.hidden}
        >
          <Loader
            type="spinner"
            size={{ width: "1.5em", height: "1.5em" }}
            color="var(--accent-color-1)"
          />
        </div>
        {cursor !== null && comments && comments.length < 1 && (
          <li className={styles.comment} key="no-comment-list">
            <p className={styles.commentText}>No comments yet</p>
          </li>
        )}

        <div ref={observerRef} className={styles.observer}></div>
      </ul>
    </div>
  );
};

export default CommentList;
