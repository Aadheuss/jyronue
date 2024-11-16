import { Link, useNavigate, useParams } from "react-router-dom";
import styles from "./PostDetailsPage.module.css";
import NavBar from "../../components/NavBar/NavBar";
import { useContext, useEffect, useRef, useState } from "react";
import CommentList from "../../components/CommentList/CommentList";
import PostImages from "../../components/PostImages/PostImages";
import { unescapeInput } from "../../utils/htmlDecoder";
import LikeButton from "../../components/LikeButton/LikeButton";
import { UserContext } from "../../context/context";
import { PostValue } from "../../config/typeValues";
import avatar from "../../assets/images/avatar_icon.svg";
import ReplyButton from "../../components/ReplyButton/ReplyButton";

const PostDetailsPage = () => {
  const { user } = useContext(UserContext);
  const postId = useParams().postid;
  const [post, setPost] = useState<null | PostValue>(null);
  const commentInputRef = useRef<null | HTMLInputElement>(null);
  const navigate = useNavigate();

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
    setPost({ ...post, likesBox, userLikeStatus } as PostValue);
  };

  const focusCommentInput = () => {
    if (user) {
      commentInputRef.current?.focus();
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <header>
        <NavBar activeNavButton={null} />
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
                  src={post?.author.profileImage.pictureUrl || avatar}
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
                  userLikeStatus={post ? post.userLikeStatus : false}
                />
                <ReplyButton
                  onClick={() => {
                    if (user === false) {
                      navigate("/login");
                    }

                    focusCommentInput();
                  }}
                />
              </div>
              <p className={styles.likeInfo}>
                <span className={styles.likeNumber}>
                  {post && post.likesBox._count.likes}
                </span>{" "}
                likes
              </p>
            </div>
          </div>

          <CommentList commentInputRef={commentInputRef} />
        </div>
      </main>
    </>
  );
};

export default PostDetailsPage;
