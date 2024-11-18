import NavBar from "../../components/NavBar/NavBar";
import styles from "./ProfilePage.module.css";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PostGallery, UserProfileValue } from "../../config/typeValues";
import { UserContext } from "../../context/context";
import avatar from "../../assets/images/avatar_icon.svg";
import { fetchData } from "../../utils/fetchFunctions";
import Gallery from "../../components/Gallery/Gallery";
import { unescapeInput } from "../../utils/htmlDecoder";
import ProfilePageSkeleton from "./ProfilePageSkeleton";
import Loader from "../../components/Loader/Loader";

const ProfilePage = () => {
  const { user } = useContext(UserContext);
  const { username } = useParams();
  const [notFound, setNotFound] = useState<boolean>(false);
  const [profile, setProfile] = useState<null | UserProfileValue>(null);
  const [posts, setPosts] = useState<null | PostGallery[]>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (username) {
        const [userProfile, userPosts] = await Promise.all([
          fetchData({
            link: `http://localhost:3000/user/profile?username=${username}`,
            options: {
              method: "GET",
              credentials: "include",
            },
          }),
          fetchData({
            link: `http://localhost:3000/user/${username}/posts`,
            options: {
              method: "GET",
              credentials: "include",
            },
          }),
        ]);

        if (userProfile?.status === 404 || userPosts?.status === 404) {
          setNotFound(true);
        }

        if (userProfile?.isError || userProfile?.isError) {
          console.error(userProfile?.data.error, userProfile?.data.errors);
          console.error(userPosts?.data.error, userPosts?.data.errors);
        } else {
          setProfile(userProfile?.data.profile);

          setPosts(userPosts?.data.userPosts);
          console.log(userPosts?.data);
        }
      }
    };

    fetchUserProfile();

    return () => {
      setProfile(null);
    };
  }, [username]);

  const toggleFollow = async () => {
    const type = profile?.isFollowing ? "unfollow" : "follow";

    const formData = new URLSearchParams();
    formData.append("username", username as string);

    const follows = await fetchData({
      link: `http://localhost:3000/user/${type}`,
      options: {
        method: "POST",
        credentials: "include",
        body: formData,
      },
    });

    if (follows?.isError || follows?.isError) {
      console.error(follows?.data.error, follows?.data.errors);
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
                                  onClick={() => navigate("/setting")}
                                >
                                  Edit profile
                                </button>
                              ) : (
                                <button
                                  className={styles.followButton}
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
                </div>
              </>
            ) : (
              <ProfilePageSkeleton />
            )}
            {posts ? (
              posts.length > 0 ? (
                <Gallery posts={posts} />
              ) : (
                <div>
                  <p className={styles.emptyPosts}>Nothing here yet</p>
                </div>
              )
            ) : (
              <div className={styles.spinnerContainer}>
                <Loader
                  size={{ width: "2em", height: "2em" }}
                  color="var(--accent-color-1)"
                  type="spinner"
                />
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
};

export default ProfilePage;
