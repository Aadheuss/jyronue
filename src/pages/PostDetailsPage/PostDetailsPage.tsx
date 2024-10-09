import { useParams } from "react-router-dom";
import styles from "./PostDetailsPage.module.css";
import NavBar from "../../components/NavBar/NavBar";
import { useEffect, useState } from "react";
import CommentList from "../../components/CommentList/CommentList";

type content = {
  id: string;
  postId: string;
  url: string;
};

type PostValue = {
  id: string;
  authorid: string;
  createdAt: string;
  updatedAt: string;
  caption: string;
  content: content[];
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
    comments: number;
    replies: number;
  };
};

const PostDetailsPage = () => {
  const { postid } = useParams();
  const [post, setPost] = useState<null | PostValue>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:3000/post/${postid}`, {
          method: "GET",
          credentials: "include",
        });

        const resData = await res.json();
        console.log(resData);

        if (resData.error) {
          console.log(resData.error);
        } else {
          console.log(resData);
          setPost(resData.post);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchPost();
  }, [postid]);

  return (
    <>
      <header>
        <NavBar />
      </header>
      <main className={styles.mainWrapper}>
        <div className={styles.postImages}></div>
        <div className={styles.postData}>
          <div className={styles.postProfile}>
            <img
              className={styles.postUserProfile}
              src={post?.author.profileImage.pictureUrl}
            ></img>
            <div className={styles.postProfileItem}>
              <p className={styles.displayName}>
                {post && post.author.displayName}
              </p>
              <p className={styles.username}>
                {post && `@${post.author.username}`}
              </p>
            </div>
          </div>
          <p>{post && post.caption}</p>
          <div className={styles.interactionInfo}>
            <div className={styles.interactionButtons}>
              <button
                data-like={post?.likesBox.id}
                className={styles.like}
              ></button>
              <button className={styles.reply}></button>
            </div>
            <p className={styles.likeInfo}>
              <span className={styles.likeNumber}>
                {post && post.likesBox._count.likes}
              </span>{" "}
              likes
            </p>
          </div>
          <CommentList />
        </div>
      </main>
    </>
  );
};

export default PostDetailsPage;
