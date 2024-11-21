import styles from "./HomePage.module.css";
import NavBar from "../../components/NavBar/NavBar";
import { useContext, useEffect, useRef, useState } from "react";
import { PostValue } from "../../config/typeValues";
import { fetchData } from "../../utils/fetchFunctions";
import PostItem from "../../components/PostItem/PostItem";
import { UserContext } from "../../context/context";
import { useNavigate } from "react-router-dom";
import PostItemSkeleton from "../../components/PostItem/PostItemSkeleton";
import Loader from "../../components/Loader/Loader";
const domain = import.meta.env.VITE_DOMAIN;

const HomePage = () => {
  const { user } = useContext(UserContext);
  const [posts, setPosts] = useState<null | PostValue[]>(null);
  const [cursor, setCursor] = useState<null | false | string>(null);
  const [isScrollLoading, setIsScrollLoading] = useState<boolean>(false);
  const observerRef = useRef(null);
  const navigate = useNavigate();

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
    if (posts) {
      const selectedPost = posts.find(
        (post) => post.likesBox.id === likesBox.id
      );
      const changedPost = { ...selectedPost, likesBox, userLikeStatus };
      const updatedPosts = posts.map((post) => {
        return post.id === changedPost.id ? changedPost : post;
      }) as PostValue[];

      setPosts([...updatedPosts]);
    }
  };

  useEffect(() => {
    if (user === false) {
      navigate("/explore");
    }

    const fetchFollowingPosts = async ({
      cursor,
    }: {
      cursor: null | false | string;
    }) => {
      const currentQuery = cursor ? `&cursor=${cursor}` : "";

      if (cursor === null || cursor) {
        if (cursor !== null) {
          setIsScrollLoading(true);
        }

        const followingPosts = await fetchData({
          link: `${domain}/posts/following?limit=3${currentQuery}`,
          options: {
            method: "GET",
            credentials: "include",
          },
        });

        if (followingPosts?.isError) {
          console.error(
            followingPosts?.data.error,
            followingPosts?.data.errors
          );
        } else {
          setCursor(followingPosts?.data.nextCursor);
          setPosts(
            posts
              ? [...posts, ...(followingPosts?.data.posts || [])]
              : followingPosts?.data.posts
          );
        }

        setIsScrollLoading(false);
      }
    };

    const current = observerRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Fetch new data only if another fetch hasn't started
          // and not the first initial fetch
          if (!isScrollLoading) {
            if (cursor !== null) {
              fetchFollowingPosts({ cursor });
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
      // Initial fetch
      fetchFollowingPosts({ cursor });
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [user, navigate, cursor, posts, isScrollLoading]);

  return (
    <>
      <NavBar activeNavButton={3} />
      <main className={styles.mainWrapper}>
        <ul className={styles.postList}>
          {posts ? (
            posts.length > 0 ? (
              <>
                {posts.map((post) => {
                  return (
                    <PostItem
                      post={post}
                      updateLikesBox={updateLikesBox}
                      key={post.id}
                    />
                  );
                })}
              </>
            ) : (
              <div>
                <h2 className={styles.emptyPosts}>Nothing here yet</h2>
                <p className={styles.text}>
                  Follow more people to see their posts on your feed
                </p>
              </div>
            )
          ) : (
            <>
              <PostItemSkeleton />
              <PostItemSkeleton />
            </>
          )}

          <div
            className={isScrollLoading ? styles.loaderContainer : styles.hidden}
          >
            <Loader
              type="spinner"
              size={{ width: "1.5em", height: "1.5em" }}
              color="var(--accent-color-1)"
            />
          </div>

          <div ref={observerRef} className={styles.observer}></div>
        </ul>
      </main>
    </>
  );
};

export default HomePage;
