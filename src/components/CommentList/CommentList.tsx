import React, { FC, useContext, useEffect, useRef, useState } from "react";
import styles from "./CommentList.module.css";
import { useParams } from "react-router-dom";
import CommentBox from "../CommentBox/CommentBox";
import { CommentValue } from "../../config/typeValues";
import Comment from "../Comment/Comment";
import { UserContext } from "../../context/context";
import { fetchData } from "../../utils/fetchFunctions";
import Loader from "../Loader/Loader";

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

      setIsScrollLoading(true);

      if (cursor === null || cursor) {
        const commentsData = await fetchData({
          link: `http://localhost:3000/post/${postid}/comments?limit=100${cursorQuery}`,
          options: {
            method: "GET",
            credentials: "include",
          },
        });

        if (commentsData?.isError) {
          console.error(commentsData?.data.error, commentsData?.data.errors);
        } else {
          setCursor(commentsData?.data.nextCursor);
          setComments(
            comments
              ? [...comments, ...(commentsData?.data.comments || [])]
              : commentsData?.data.comments
          );
        }
      }

      setIsScrollLoading(false);
    };

    const current = observerRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        console.log(entries[0].intersectionRatio);
        if (entries[0].isIntersecting) {
          // Fetch new data if only another fetch hasn't started
          if (!isScrollLoading) {
            fetchComments({ cursor });
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
      // Fetch initial comments
      fetchComments({ cursor });
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [postid, cursor, comments]);

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
        {comments && comments.length > 0 ? (
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
            {isScrollLoading && (
              <div className={styles.loaderContainer}>
                <Loader
                  type="spinner"
                  size={{ width: "1.5em", height: "1.5em" }}
                  color="var(--accent-color-1)"
                />
              </div>
            )}
            <div ref={observerRef} className={styles.observer}></div>
          </>
        ) : (
          <li className={styles.comment} key="no-comment-list">
            <p className={styles.commentText}>No comments yet</p>
          </li>
        )}
      </ul>
    </div>
  );
};

export default CommentList;
