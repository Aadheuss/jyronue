import { Link, useParams } from "react-router-dom";
import styles from "./PostDetailsPage.module.css";
import NavBar from "../../components/NavBar/NavBar";
import { useEffect, useRef, useState } from "react";
import CommentList from "../../components/CommentList/CommentList";
import PostImages from "../../components/PostImages/PostImages";
import { unescapeInput } from "../../utils/htmlDecoder";
import LikeButton from "../../components/LikeButton/LikeButton";

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
  const postId = useParams().postid;
  const [post, setPost] = useState<null | PostValue>(null);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:3000/post/${postId}`, {
          method: "GET",
          credentials: "include",
        });

        const resData = await res.json();

        if (resData.error) {
          console.log(resData.error);
        } else {
          console.log(resData.post);
          setPost(resData.post);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchPost();

    return () => {
      setPost(null);
    };
  }, [postId]);

  const updateLikesBox = ({
    likesBox,
  }: {
    likesBox: {
      id: string;
      _count: {
        likes: number;
      };
    };
  }) => {
    setPost({ ...post, likesBox } as PostValue);
  };

  return (
    <>
      <header ref={headerRef}>
        <NavBar />
      </header>
      <main className={styles.mainWrapper}>
        <PostImages images={post ? post.content : null} />
        <div className={styles.postData}>
          <div className={styles.postDataItem}>
            <div className={styles.postProfile}>
              <Link to={post ? `/profile/${post.author.username}` : ""}>
                {" "}
                <img
                  className={styles.postUserProfile}
                  src={post?.author.profileImage.pictureUrl}
                ></img>
              </Link>
              <div className={styles.postProfileItem}>
                <Link
                  to={post ? `/profile/${post.author.username}` : ""}
                  className={styles.displayName}
                >
                  {post && post.author.displayName}
                </Link>
                <Link
                  to={post ? `/profile/${post.author.username}` : ""}
                  className={styles.username}
                >
                  {post && `@${post.author.username}`}
                </Link>
              </div>
            </div>
            <p className={styles.text}>{post && unescapeInput(post.caption)}</p>
            <div className={styles.interactionInfo}>
              <div className={styles.interactionButtons}>
                <LikeButton
                  id={postId}
                  type="post"
                  likesBoxId={post ? post.likesBox.id : null}
                  likesBox={post ? post.likesBox : null}
                  updateLikesBox={updateLikesBox}
                />
                <button className={styles.reply}></button>
              </div>
              <p className={styles.likeInfo}>
                <span className={styles.likeNumber}>
                  {post && post.likesBox._count.likes}
                </span>{" "}
                likes
              </p>
            </div>
          </div>

          <CommentList />
        </div>
      </main>
    </>
  );
};

export default PostDetailsPage;
