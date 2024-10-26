import NavBar from "../../components/NavBar/NavBar";
import styles from "./ProfilePage.module.css";
import logo from "../../assets/images/mr-karl-unsplash.jpg";

const ProfilePage = () => {
  return (
    <>
      <NavBar />
      <main className={styles.mainWrapper}>
        <div className={styles.profileContainer}>
          <div className={styles.userProfile}>
            <div className={styles.banner}>
              <img
                className={styles.bannerImage}
                src={logo}
                alt="Profile banner"
              ></img>
            </div>
            <div className={styles.profileInfo}>
              <div className={styles.profileDetails}>
                <div className={styles.topItem}>
                  <div className={styles.profileImageContainer}>
                    <img
                      className={styles.profileImage}
                      src={logo}
                      alt="Profile Image"
                    ></img>
                  </div>
                  <div className={styles.topItemChild}>
                    <div className={styles.profileNames}>
                      <p className={styles.displayName}>Display name</p>
                      <p className={styles.username}>@username</p>
                    </div>
                  </div>

                  <button className={styles.followButton}>Follow</button>
                </div>

                <div className={styles.bottomItem}>
                  <p className={styles.bio}>
                    Emily Carter is an environmentalist and freelance writer in
                    Seattle. With a degree in Environmental Science, she
                    advocates for sustainability and conservation. In her free
                    time, she enjoys hiking, visiting farmers' markets, and
                    volunteering with wildlife organizations.
                  </p>
                  <div className={styles.follows}>
                    <p className={styles.followText}>
                      <span className={styles.followNumber}>0</span> following
                    </p>
                    <p className={styles.followText}>
                      <span className={styles.followNumber}>9</span> followers
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
      </main>
    </>
  );
};

export default ProfilePage;
