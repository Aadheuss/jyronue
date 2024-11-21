import styles from "./ExplorePage.module.css";
import NavBar from "../../components/NavBar/NavBar";
import { useEffect, useRef, useState } from "react";
import { PostGallery } from "../../config/typeValues";
import { fetchData } from "../../utils/fetchFunctions";
import Gallery from "../../components/Gallery/Gallery";
import GallerySkeleton from "../../components/Gallery/GallerySkeleton";
import Loader from "../../components/Loader/Loader";
const domain = import.meta.env.VITE_DOMAIN;

const ExplorePage = () => {
  const [posts, setPosts] = useState<null | PostGallery[]>(null);
  const [cursor, setCursor] = useState<null | false | string>(null);
  const observerRef = useRef<null | HTMLDivElement>(null);
  const [isScrollLoading, setIsScrollLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchPosts = async ({
      cursor,
    }: {
      cursor: null | false | string;
    }) => {
      const currentQuery = cursor ? `&cursor=${cursor}` : "";
      const limit = 20;

      if (cursor === null || cursor) {
        if (cursor !== null) {
          setIsScrollLoading(true);
        }

        const postsData = await fetchData({
          link: `${domain}/posts?limit=${limit}${currentQuery}`,
          options: {
            method: "GET",
            credentials: "include",
          },
        });

        if (postsData?.isError) {
          console.error(postsData?.data.error, postsData?.data.errors);
        } else {
          const nextCursor =
            postsData?.data.posts.length >= limit
              ? postsData?.data.nextCursor
              : false;
          setCursor(nextCursor);
          setPosts(
            posts
              ? [...posts, ...(postsData?.data.posts || [])]
              : postsData?.data.posts
          );
        }

        setIsScrollLoading(false);
      }
    };

    const current = observerRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Only fetch if another fetch hasn't started
          // and not the first initial fetch
          if (!isScrollLoading) {
            if (cursor !== null) {
              fetchPosts({ cursor });
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
  }, [posts, cursor, isScrollLoading]);

  return (
    <>
      <NavBar activeNavButton={1} />
      <main className={styles.mainWrapper}>
        <div className={styles.mainContent}>
          <h2 className={styles.heading}>Explore latest posts</h2>
          {posts ? <Gallery posts={posts} /> : <GallerySkeleton amount={20} />}
          <div
            className={isScrollLoading ? styles.loaderContainer : styles.hidden}
          >
            <Loader
              type="spinner"
              size={{ width: "1.5em", height: "1.5em" }}
              color="var(--accent-color-1)"
            />
          </div>
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
