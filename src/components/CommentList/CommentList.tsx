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
      const limit = 3;

      if (cursor !== null) {
        setIsScrollLoading(true);
      }

      const commentsData = await fetchData({
        link: `http://localhost:3000/post/${postid}/comments?limit=${limit}${cursorQuery}`,
        options: {
          method: "GET",
          credentials: "include",
        },
      });

      if (commentsData?.isError) {
        console.error(commentsData?.data.error, commentsData?.data.errors);
      } else {
        const nextCursor =
          commentsData?.data.comments.length >= limit
            ? commentsData?.data.nextCursor
            : false;
        setCursor(nextCursor);
        setComments(
          comments
            ? [...comments, ...(commentsData?.data.comments || [])]
            : commentsData?.data.comments
        );
      }

      setIsScrollLoading(false);
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
