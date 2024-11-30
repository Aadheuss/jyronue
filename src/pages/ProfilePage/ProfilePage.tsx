import NavBar from "../../components/NavBar/NavBar";
import styles from "./ProfilePage.module.css";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PostGallery, UserProfileValue } from "../../config/typeValues";
import { UserContext } from "../../context/context";
import avatar from "../../assets/images/avatar_icon.svg";
import Gallery from "../../components/Gallery/Gallery";
import { unescapeInput } from "../../utils/htmlDecoder";
import ProfilePageSkeleton from "./ProfilePageSkeleton";
import Loader from "../../components/Loader/Loader";
const domain = import.meta.env.VITE_DOMAIN;

const ProfilePage = () => {
  const { user } = useContext(UserContext);
  const { username } = useParams();
  const [notFound, setNotFound] = useState<boolean>(false);
  const [profile, setProfile] = useState<null | UserProfileValue>(null);
  const [posts, setPosts] = useState<null | PostGallery[]>(null);
  const [cursor, setCursor] = useState<null | string | false>(null);
  const [isScrollLoading, setIsScrollLoading] = useState<boolean>(false);
  const observerRef = useRef<null | HTMLDivElement>(null);
  const [currentUsername, setCurrentUsername] = useState<null | string>(null);
  const [initialFetch, setInitalFetch] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfile = await fetch(
          `${domain}/user/profile?username=${username}`,
          {
            mode: "cors",
            method: "GET",
            credentials: "include",
          }
        );

        const userProfileData = await userProfile.json();

        if (userProfile.status === 404) {
          setNotFound(true);
          return;
        }

        if (userProfileData.error) {
          console.error(
            `${userProfileData.error.message}: Profile page profile`
          );
        } else {
          setProfile(userProfileData.profile);
        }
      } catch (err) {
        if (err instanceof TypeError) console.log(err.message);
      }
    };

    const fetchUserPosts = async ({
      cursor,
    }: {
      cursor: null | string | false;
    }) => {
      const cursorQuery = cursor ? `&cursor=${cursor}` : "";
      const limit = 20;

      if (cursor !== null) {
        setIsScrollLoading(true);
      }

      try {
        const userPosts = await fetch(
          `${domain}/user/${username}/posts?limit=${limit}${cursorQuery}`,
          {
            mode: "cors",
            method: "GET",
            credentials: "include",
          }
        );

        const userPostsData = await userPosts.json();

        if (userPosts.status === 404) {
          setNotFound(true);
          return;
        }

        if (userPostsData.error) {
          console.error(`${userPostsData.error.message}: User posts`);

          // Log validation error
          if (userPostsData.error.errors) {
            const errorList = userPostsData.error.errors;

            errorList.forEach(
              (error: { field: string; value: string; msg: string }) =>
                console.log(error.msg)
            );
          }
        } else {
          const nextCursor =
            userPostsData.userPosts.length >= limit
              ? userPostsData.nextCursor
              : false;
          setCursor(nextCursor);
          setPosts(
            posts
              ? [...posts, ...(userPostsData.userPosts || [])]
              : userPostsData.userPosts
          );
        }
      } catch (err) {
        if (err instanceof TypeError) console.log(err.message);
      } finally {
        setIsScrollLoading(false);
      }
    };

    const current = observerRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Fetch new data only if another fetch hasn't started
          // and not the first fetch

          if (!isScrollLoading && cursor !== null && cursor !== false) {
            fetchUserPosts({ cursor });
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

    //Reset data if parameter changes to rerender profile page
    if (currentUsername !== null && currentUsername !== username) {
      console.log(
        "Current profile page username changes, fetching new profile page data..."
      );
      setCursor(null);
      setProfile(null);
      setPosts(null);
      setNotFound(false);
      setIsScrollLoading(false);
      setCurrentUsername(null);
      setInitalFetch(true);
    }

    if (username) {
      if (initialFetch) {
        console.log("initial profile and posts fetch");
        setInitalFetch(false);
        // Initial fetch
        // Fetch only if initialFetch is true
        setCurrentUsername(username);
        fetchUserProfile();
        fetchUserPosts({ cursor });
      }
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [
    username,
    cursor,
    isScrollLoading,
    posts,
    profile,
    currentUsername,
    initialFetch,
  ]);

  const toggleFollow = async () => {
    const type = profile?.isFollowing ? "unfollow" : "follow";

    const formData = new URLSearchParams();
    formData.append("username", username as string);

    const follows = await fetch(`${domain}/user/${type}`, {
      mode: "cors",
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const followsData = await follows.json();

    if (followsData.error) {
      console.log(
        `${followsData.error.message}: ${followsData.error.error}: Follows`
      );

      // Log validation error
      if (followsData.error.errors) {
        const errorList = followsData.error.errors;

        errorList.forEach(
          (error: { field: string; value: string; msg: string }) =>
            console.log(error.msg)
        );
      }
    } else {
      if (profile) {
        const followedBy = profile?._count.followedBy;

        setProfile({
          ...profile,
          isFollowing: !profile.isFollowing,
          _count: {
            ...profile._count,
            followedBy: type === "follow" ? followedBy + 1 : followedBy - 1,
          },
        });
      }
    }
  };

  return (
    <>
      <NavBar
        activeNavButton={user ? (username === user.username ? 2 : null) : null}
      />
      <main className={styles.mainWrapper}>
        {notFound ? (
          <div className={styles.notFoundContainer}>
            <p className={styles.notFoundText}>
              This user profile doesn't exist
            </p>
            <Link className={styles.link} to="/">
              Go back to Homepage
            </Link>
          </div>
        ) : (
          <>
            {profile ? (
              <>
                <div className={styles.profileContainer}>
                  <div className={styles.userProfile}>
                    <div className={styles.banner}>
                      {profile.profileImage.bannerUrl && (
                        <img
                          className={styles.bannerImage}
                          src={profile.profileImage.bannerUrl}
                          alt="Profile banner"
                        ></img>
                      )}{" "}
                      {}
                    </div>
                    <div className={styles.profileInfo}>
                      <div className={styles.profileDetails}>
                        <div className={styles.topItem}>
                          <div className={styles.avatarItem}>
                            <div
                              className={
                                profile.profileImage.pictureUrl
                                  ? styles.profileImageContainer
                                  : styles.profileImageContainerNull
                              }
                            >
                              <img
                                className={styles.profileImage}
                                src={profile.profileImage.pictureUrl || avatar}
                                alt="Profile Image"
                              ></img>
                            </div>
                          </div>

                          <div className={styles.topItemChild}>
                            <div className={styles.profileNames}>
                              <p className={styles.displayName}>
                                {profile.displayName}
                              </p>
                              <p
                                className={styles.username}
                              >{`@${profile.username}`}</p>
                            </div>
                          </div>
                          <div className={styles.profileButtons}>
                            {user ? (
                              user.id === profile.id ? (
                                <button
                                  className={styles.editButton}
                                  type="button"
                                  onClick={() => navigate("/setting")}
                                >
                                  Edit profile
                                </button>
                              ) : (
                                <button
                                  className={styles.followButton}
                                  type="button"
                                  onClick={toggleFollow}
                                >
                                  {profile.isFollowing ? "unfollow" : "follow"}
                                </button>
                              )
                            ) : null}
                          </div>
                        </div>

                        <div className={styles.bottomItem}>
                          <p className={styles.bio}>
                            {profile.bio ? unescapeInput(profile.bio) : ""}
                          </p>
                          <div className={styles.follows}>
                            <p className={styles.followText}>
                              <span className={styles.followNumber}>
                                {profile._count.following}
                              </span>{" "}
                              following
                            </p>
                            <p className={styles.followText}>
                              <span className={styles.followNumber}>
                                {profile._count.followedBy}
                              </span>{" "}
                              followers
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.profilePosts}>
                  <h2 className={styles.galleryHeading}>Gallery</h2>
                  {posts &&
                    (posts.length > 0 ? (
                      <Gallery posts={posts} />
                    ) : (
                      <div>
                        <p className={styles.emptyPosts}>Nothing here yet</p>
                      </div>
                    ))}
                </div>
              </>
            ) : (
              <ProfilePageSkeleton />
            )}
          </>
        )}
        <div
          className={
            isScrollLoading || posts === null
              ? styles.spinnerContainer
              : styles.hidden
          }
        >
          <Loader
            size={{ width: "min(2em, 7vw)", height: "min(2em, 7vw)" }}
            color={
              posts === null ? "var(--accent-color-3)" : "var(--accent-color-1)"
            }
            type="spinner"
          />
        </div>
        <div ref={observerRef} className={styles.observer}></div>
      </main>
    </>
  );
};

export default ProfilePage;
