import styles from "./ExplorePage.module.css";
import NavBar from "../../components/NavBar/NavBar";
import { useEffect, useState } from "react";
import { PostGallery } from "../../config/typeValues";
import { fetchData } from "../../utils/fetchFunctions";
import Gallery from "../../components/Gallery/Gallery";
import GallerySkeleton from "../../components/Gallery/GallerySkeleton";

const ExplorePage = () => {
  const [posts, setPosts] = useState<null | PostGallery[]>(null);
  const [isCursor, setIsCursor] = useState<boolean>(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const postsData = await fetchData({
        link: "http://localhost:3000/posts",
        options: {
          method: "GET",
          credentials: "include",
        },
      });

      if (postsData?.isError) {
        console.log(postsData?.data.error, postsData?.data.errors);
      } else {
        setIsCursor(postsData?.data.nextCursor);
        setPosts(postsData?.data.posts);
      }
    };

    fetchPosts();

    return () => {
      setPosts(null);
    };
  }, []);

  return (
    <>
      <NavBar activeNavButton={1} />
      <main className={styles.mainWrapper}>
        <div className={styles.mainContent}>
          <h2 className={styles.heading}>Explore latest posts</h2>
          {posts ? <Gallery posts={posts} /> : <GallerySkeleton amount={20} />}
          {!isCursor && (
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
