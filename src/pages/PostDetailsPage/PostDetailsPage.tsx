import { Link, useParams } from "react-router-dom";
import styles from "./PostDetailsPage.module.css";
import NavBar from "../../components/NavBar/NavBar";
import {
  useLayoutEffect,
  useEffect,
  useRef,
  useState,
  useContext,
} from "react";
import CommentList from "../../components/CommentList/CommentList";
import PostImages from "../../components/PostImages/PostImages";
import { unescapeInput } from "../../utils/htmlDecoder";
import { UserContext } from "../../context/context";
import { fetchLikesBox, fetchToggleLike } from "../../utils/fetchFunctions";

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
  const { user } = useContext(UserContext);
  const { postid } = useParams();
  const [post, setPost] = useState<null | PostValue>(null);
  const [likeStatus, setLikeStatus] = useState<boolean>(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const [headerHeight, setHeaderHeight] = useState<number | null>(null);
  const height = headerRef
    ? `calc(100dvh - calc(${headerHeight}px + 3rem))`
    : "100%";

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:3000/post/${postid}`, {
          method: "GET",
          credentials: "include",
        });

        const resData = await res.json();

        if (resData.error) {
          console.log(resData.error);
        } else {
          console.log(resData.post);
          setPost(resData.post);
          setLikeStatus(resData.userLikeStatus);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchPost();
  }, [postid]);

  const toggleLike = async ({
    postId,
    type,
    likesBoxId,
    setLikeStatus,
    likeStatus,
  }: {
    postId: string;
    type: string;
    likesBoxId: string;
    setLikeStatus: React.Dispatch<React.SetStateAction<boolean>>;
    likeStatus: boolean;
  }) => {
    const formData = new URLSearchParams();
    formData.append("type", type);
    formData.append("likesboxid", likesBoxId);

    const toggle = likeStatus ? "unlike" : "like";
    const toggleLikeData = await fetchToggleLike({
      postId,
      toggle,
      formData,
    });

    if (toggleLikeData && (!toggleLikeData.errors || !toggleLikeData.errors)) {
      const likesBoxData = await fetchLikesBox({ postId, likesBoxId });
      if (likesBoxData && (!likesBoxData.error || likesBoxData.errors)) {
        const likesBox = likesBoxData.likesBox;
        setPost({ ...post, likesBox } as PostValue);
        setLikeStatus(!likeStatus);
      }
    }
  };

  useLayoutEffect(() => {
    function updateHeaderHeight() {
      const current = headerRef ? headerRef.current : headerRef;
      const size = current ? current.clientHeight : null;
      setHeaderHeight(size);
    }

    window.addEventListener("resize", updateHeaderHeight);

    setTimeout(updateHeaderHeight, 0);
    setTimeout(updateHeaderHeight, 100);

    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, [headerRef]);

  return (
    <>
      <header ref={headerRef}>
        <NavBar />
      </header>
      <main className={styles.mainWrapper}>
        <PostImages
          headerHeight={headerHeight}
          images={post ? post.content : null}
        />
        <div className={styles.postData} style={{ maxHeight: height }}>
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
                <button
                  data-like={post?.likesBox.id}
                  className={
                    user
                      ? likeStatus
                        ? styles.liked
                        : styles.like
                      : styles.like
                  }
                  onClick={() => {
                    if (post && postid) {
                      toggleLike({
                        postId: postid,
                        type: "POST",
                        likesBoxId: post.likesBox.id,
                        setLikeStatus: setLikeStatus,
                        likeStatus,
                      });
                    }
                  }}
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
          </div>

          <CommentList />
        </div>
      </main>
    </>
  );
};

export default PostDetailsPage;
