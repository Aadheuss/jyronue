import NavBar from "../../components/NavBar/NavBar";
import styles from "./ProfilePage.module.css";
import logo from "../../assets/images/mr-karl-unsplash.jpg";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserProfileValue } from "../../config/typeValues";
import { UserContext } from "../../context/context";
import avatar from "../../assets/images/avatar_icon.svg";

const ProfilePage = () => {
  const { user } = useContext(UserContext);
  const { username } = useParams();
  const [notFound, setNotFound] = useState<boolean>(false);
  const [profile, setProfile] = useState<null | UserProfileValue>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      console.log({ username });
      if (username) {
        try {
          const res = await fetch(
            `http://localhost:3000/user/${username}/profile`,
            {
              method: "GET",
              credentials: "include",
            }
          );

          if (res.status === 404) {
            setNotFound(true);
          }

          const resData = await res.json();

          if (resData.error || resData.errors) {
            console.error(resData.error);
          } else {
            console.log(resData.profile);
            setProfile(resData.profile);
          }
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchUserProfile();

    return () => {
      setProfile(null);
    };
  }, [username]);

  return (
    <>
      <NavBar />
      <main className={styles.mainWrapper}>
        {notFound ? (
          <p className={styles.text}>This user profile doesn't exist</p>
        ) : (
          <>
            {profile && (
              <>
                <div className={styles.profileContainer}>
                  <div className={styles.userProfile}>
                    <div className={styles.banner}>
                      {profile.profileImage.bannerUrl && (
                        <img
                          className={styles.bannerImage}
                          src={logo}
                          alt="Profile banner"
                        ></img>
                      )}{" "}
                      {}
                    </div>
                    <div className={styles.profileInfo}>
                      <div className={styles.profileDetails}>
                        <div className={styles.topItem}>
                          <div className={styles.profileImageContainer}>
                            <img
                              className={styles.profileImage}
                              src={profile.profileImage.pictureUrl || avatar}
                              alt="Profile Image"
                            ></img>
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

                          {user ? (
                            user.id === profile.id ? (
                              <button className={styles.editButton}>
                                Edit profile
                              </button>
                            ) : (
                              <button className={styles.followButton}>
                                Follow
                              </button>
                            )
                          ) : null}
                        </div>

                        <div className={styles.bottomItem}>
                          <p className={styles.bio}>{profile.bio || ""}</p>
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
                  <p>Gallery</p>
                </div>
              </>
            )}
          </>
        )}
      </main>
    </>
  );
};

export default ProfilePage;
