import styles from "./ExplorePage.module.css";
import NavBar from "../../components/NavBar/NavBar";
import { useEffect, useRef, useState } from "react";
import { PostGallery } from "../../config/typeValues";
import { fetchData } from "../../utils/fetchFunctions";
import Gallery from "../../components/Gallery/Gallery";
import GallerySkeleton from "../../components/Gallery/GallerySkeleton";
import Loader from "../../components/Loader/Loader";

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

      if (cursor) {
        setIsScrollLoading(true);
      }

      if (cursor === null || cursor) {
        const postsData = await fetchData({
          link: `http://localhost:3000/posts?limit=20${currentQuery}`,
          options: {
            method: "GET",
            credentials: "include",
          },
        });

        if (postsData?.isError) {
          console.log(postsData?.data.error, postsData?.data.errors);
        } else {
          setCursor(postsData?.data.nextCursor);
          setPosts(
            posts
              ? [...posts, ...(postsData?.data.posts || [])]
              : postsData?.data.posts
          );
        }
      }

      setIsScrollLoading(false);
    };

    const current = observerRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchPosts({ cursor });
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
  }, [posts, cursor]);

  return (
    <>
      <NavBar activeNavButton={1} />
      <main className={styles.mainWrapper}>
        <div className={styles.mainContent}>
          <h2 className={styles.heading}>Explore latest posts</h2>
          {posts ? <Gallery posts={posts} /> : <GallerySkeleton amount={20} />}
          {isScrollLoading && (
            <div className={styles.loaderContainer}>
              <Loader
                type="spinner"
                size={{ width: "1.5em", height: "1.5em" }}
                color="var(--accent-color-1)"
              />
            </div>
          )}
          <div ref={observerRef} className={styles.observer}></div>
          {cursor === false && (
            <p className={styles.text}>
              You have reached the end, no more posts to explore
            </p>
          )}
        </div>
      </main>
    </>
  );
};

export default ExplorePage;
