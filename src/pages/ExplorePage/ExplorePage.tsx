import styles from "./ExplorePage.module.css";
import NavBar from "../../components/NavBar/NavBar";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { PostGallery } from "../../config/typeValues";
import Gallery from "../../components/Gallery/Gallery";
import GallerySkeleton from "../../components/Gallery/GallerySkeleton";
import Loader from "../../components/Loader/Loader";
import ErrorElement from "../../components/ErrorElement/ErrorElement";
import { RefetchUserContext } from "../../context/context";
const domain = import.meta.env.VITE_DOMAIN;

const ExplorePage = () => {
  const { setRefetchUser } = useContext(RefetchUserContext);
  const [posts, setPosts] = useState<null | PostGallery[]>(null);
  const [cursor, setCursor] = useState<null | false | string>(null);
  const observerRef = useRef<null | HTMLDivElement>(null);
  const [isScrollLoading, setIsScrollLoading] = useState<boolean>(false);
  const [caughtError, setCaughtError] = useState<boolean>(false);
  const fetchPosts = useCallback(
    async ({ cursor }: { cursor: null | false | string }) => {
      const currentQuery = cursor ? `&cursor=${cursor}` : "";
      const limit = 3;

      // Only fetch if the cursor is not false
      if (cursor === null || cursor) {
        if (cursor !== null) {
          setIsScrollLoading(true);
        }

        try {
          const postsResponse = await fetch(
            `${domain}/posts?limit=${limit}${currentQuery}`,
            {
              mode: "cors",
              method: "GET",
              credentials: "include",
            }
          );

          const postsData = await postsResponse.json();

          if (postsData.error) {
            console.log(`${postsData.error.message}: Explore page posts`);
            // Log validation error
            if (postsData.error.errors) {
              const errorList = postsData.error.errors;

              errorList.forEach(
                (error: { field: string; value: string; msg: string }) =>
                  console.log(error.msg)
              );
            }
          } else {
            console.log("Successfully fetched explore page posts");
            const nextCursor =
              postsData.posts.length >= limit ? postsData.nextCursor : false;
            setCursor(nextCursor);
            setPosts(
              posts ? [...posts, ...(postsData.posts || [])] : postsData.posts
            );
          }
        } catch (err) {
          console.log(
            "Something went wrong! failed to load explore page posts"
          );
          if (err instanceof TypeError)
            console.log(err.message + ": Explore page posts");
          setCaughtError(true);
        } finally {
          setIsScrollLoading(false);
        }
      }
    },
    [posts]
  );

  useEffect(() => {
    const current = observerRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Only fetch if another fetch hasn't started
          // and not the first initial fetch
          if (!isScrollLoading) {
            if (cursor !== null && !caughtError) {
              fetchPosts({ cursor });
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
      fetchPosts({ cursor });
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [posts, cursor, isScrollLoading, fetchPosts, caughtError]);

  return (
    <>
      <NavBar activeNavButton={1} />
      <main className={styles.mainWrapper}>
        <div className={styles.mainContent}>
          <h2 className={styles.heading}>Explore latest posts</h2>
          {posts ? (
            <Gallery posts={posts} />
          ) : (
            !caughtError && <GallerySkeleton amount={20} />
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
                          `Reefetching explore page posts with cursor: ${cursor}`
                        );

                        setCaughtError(false);
                        fetchPosts({ cursor });
                        setRefetchUser(true);
                      }}
                    ></button>
                  </div>
                </>
              }
            />
          )}

          {cursor === false && (
            <p className={styles.text}>
              You have reached the end, no more posts to explore
            </p>
          )}
          <div ref={observerRef} className={styles.observer}></div>
        </div>
      </main>
    </>
  );
};

export default ExplorePage;
