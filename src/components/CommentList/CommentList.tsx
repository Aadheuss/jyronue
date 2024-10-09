import { useEffect, useState } from "react";
import styles from "./CommentList.module.css";
import { Link, useParams } from "react-router-dom";

type CommentValue = {
  id: string;
  createdAt: string;
  updatedAt: string;
  authorid: string;
  postId: string;
  content: string;
  author: {
    displayName: string;
    username: string;
    profileImage: {
      pictureUrl: string;
    };
  };
  likesBox: {
    id: string;
    _count: {
      likes: number;
    };
  };
  _count: {
    replies: number;
  };
};

const CommentList = () => {
  const { postid } = useParams();
  const [comments, setComments] = useState<null | CommentValue[]>(null);

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
        console.log(resData);

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

  console.log(comments);

  return (
    <ul className={styles.comments}>
      <p className={styles.text}>Comments</p>
      {comments && comments.length > 0 ? (
        comments.map((comment) => {
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
                <p className={styles.commentText}>{comment.content}</p>
              </div>
            </li>
          );
        })
      ) : (
        <li>
          <p>No comments yet</p>
        </li>
      )}
    </ul>
  );
};

export default CommentList;
