import styles from "./HomePage.module.css";
import NavBar from "../../components/NavBar/NavBar";
import { useContext, useEffect, useState } from "react";
import { PostValue } from "../../config/typeValues";
import { fetchData } from "../../utils/fetchFunctions";
import PostItem from "../../components/PostItem/PostItem";
import { UserContext } from "../../context/context";
import { useNavigate } from "react-router-dom";
import PostItemSkeleton from "../../components/PostItem/PostItemSkeleton";

const HomePage = () => {
  const { user } = useContext(UserContext);
  const [posts, setPosts] = useState<null | PostValue[]>(null);
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

    const fetchFollowingPosts = async () => {
      const followingPosts = await fetchData({
        link: `http://localhost:3000/posts/following`,
        options: {
          method: "GET",
          credentials: "include",
        },
      });

      if (followingPosts?.isError) {
        console.error(followingPosts?.data.error, followingPosts?.data.errors);
      } else {
        console.log(followingPosts?.data.posts);
        setPosts(followingPosts?.data.posts);
      }
    };

    fetchFollowingPosts();

    return () => {};
  }, [user, navigate]);

  return (
    <>
      <NavBar activeNavButton={3} />
      <main className={styles.mainWrapper}>
        <ul className={styles.postList}>
          {posts ? (
            posts.map((post) => {
              return (
                <PostItem
                  post={post}
                  updateLikesBox={updateLikesBox}
                  key={post.id}
                />
              );
            })
          ) : (
            <>
              <PostItemSkeleton />
              <PostItemSkeleton />
            </>
          )}
        </ul>
      </main>
    </>
  );
};

export default HomePage;
