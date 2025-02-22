import styles from "./HomePage.module.css";
import NavBar from "../../components/NavBar/NavBar";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { PostValue } from "../../config/typeValues";
import PostItem from "../../components/PostItem/PostItem";
import { RefetchUserContext, UserContext } from "../../context/context";
import { useNavigate } from "react-router-dom";
import PostItemSkeleton from "../../components/PostItem/PostItemSkeleton";
import Loader from "../../components/Loader/Loader";
import ErrorElement from "../../components/ErrorElement/ErrorElement";
const domain = import.meta.env.VITE_DOMAIN;

const HomePage = () => {
  const { user } = useContext(UserContext);
  const { setRefetchUser } = useContext(RefetchUserContext);
  const [posts, setPosts] = useState<null | PostValue[]>(null);
  const [cursor, setCursor] = useState<null | false | string>(null);
  const [isScrollLoading, setIsScrollLoading] = useState<boolean>(false);
  const observerRef = useRef(null);
  const [caughtError, setCaughtError] = useState<boolean>(false);
  const navigate = useNavigate();
  const fetchFollowingPosts = useCallback(
    async ({ cursor }: { cursor: null | false | string }) => {
      const currentQuery = cursor ? `&cursor=${cursor}` : "";

      if (cursor === null || cursor) {
        if (cursor !== null) {
          setIsScrollLoading(true);
        }

        try {
          const followingPosts = await fetch(
            `${domain}/posts/following?limit=3${currentQuery}`,
            {
              mode: "cors",
              method: "GET",
              credentials: "include",
            }
          );

          const followingPostsData = await followingPosts.json();

          if (followingPostsData.error) {
            console.log(
              `${followingPostsData.error.message}: Followed users posts`
            );

            // Handle validation error
            if (followingPostsData.error.errors) {
              const errorList = followingPostsData.error.errors;

              errorList.forEach(
                (error: { field: string; value: string; msg: string }) => {
                  console.log(error.msg);
                }
              );
            }
          } else {
            console.log("Successfully fetched followed users posts");
            setCursor(followingPostsData.nextCursor);
            setPosts(
              posts
                ? [...posts, ...(followingPostsData.posts || [])]
                : followingPostsData.posts
            );
          }
        } catch (err) {
          if (err instanceof TypeError) console.log(err.message);
          // Handle caught error ui
          setCaughtError(true);
        } finally {
          setIsScrollLoading(false);
        }
      }
    },
    [posts]
  );

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
    console.log({ user });

    if (user === false) {
      navigate("/explore");
      return;
    }

    const current = observerRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Fetch new data only if another fetch hasn't started
          // and not the first initial fetch
          if (!isScrollLoading) {
            if (cursor !== null && !caughtError) {
              if (user) {
                fetchFollowingPosts({ cursor });
              }
            }

            if (caughtError) {
              setIsScrollLoading(false);
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
      if (user) {
        fetchFollowingPosts({ cursor });
      }
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [
    user,
    navigate,
    cursor,
    posts,
    isScrollLoading,
    caughtError,
    fetchFollowingPosts,
  ]);

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
            !caughtError && (
              <>
                <PostItemSkeleton />
                <PostItemSkeleton />
              </>
            )
          )}
          {caughtError && (
            <ErrorElement
              parentStyles={styles}
              children={
                <>
                  <p className={styles.errorMsg}>Something went wrong</p>
                  <div>
                    <button
                      className={styles.refetchButton}
                      type="button"
                      aria-label="Retry"
                      onClick={() => {
                        console.log(
                          `Refetching followed users posts with cursor: ${cursor}`
                        );

                        setCaughtError(false);
                        fetchFollowingPosts({ cursor });
                        setRefetchUser(true);
                      }}
                    ></button>
                  </div>
                </>
              }
            />
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
