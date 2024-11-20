import styles from "./ProfilePage.module.css";
import { useContext } from "react";
import { UserContext } from "../../context/context";

const ProfilePageSkeleton = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      <div className={styles.profileContainer}>
        <div className={styles.userProfile}>
          <div className={styles.bannerSkeleton}></div>
          <div className={styles.profileInfo}>
            <div className={styles.profileDetails}>
              <div className={styles.topItem}>
                <div className={styles.avatarItem}>
                  <div className={styles.profileImageContainer}>
                    <div className={styles.profileImageSkeleton}></div>
                  </div>
                </div>
                <div className={styles.topItemChild}>
                  <div className={styles.profileNames}>
                    <div className={styles.displayNameSkeleton}></div>
                    <div className={styles.usernameSkeleton}></div>
                  </div>
                </div>
                <div className={styles.profileButtons}>
                  {user ? <div className={styles.buttonSkeleton}></div> : null}
                </div>
              </div>
              <div className={styles.bottomItem}>
                <div className={styles.bioContainer}>
                  <div className={styles.bioSkeleton}></div>
                  <div className={styles.bioSkeletonTwo}></div>
                </div>
                <div className={styles.follows}>
                  <div className={styles.followTextSkeleton}></div>
                  <div className={styles.followTextSkeleton}></div>
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
  );
};

export default ProfilePageSkeleton;
