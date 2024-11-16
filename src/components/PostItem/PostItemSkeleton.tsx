import styles from "./PostItem.module.css";

const PostItemSkeleton = () => {
  return (
    <div className={styles.list}>
      <div className={styles.postItem}>
        <div className={styles.profileContainer}>
          <div className={styles.avatarSkeleton}></div>
          <div className={styles.profileNames}>
            <div className={styles.displayNameSkeleton}></div>
            <div className={styles.usernameSkeleton}></div>
          </div>
          <div />
        </div>
        <div className={styles.slideshowSkeleton}></div>
        <div>
          <div className={styles.infoBox}>
            <div className={styles.interactionButtons}>
              <div className={styles.buttonSkeleton}></div>
              <div className={styles.buttonSkeleton}></div>
            </div>
            <div className={styles.countBox}>
              <p className={styles.countTextSkeleton}></p>
              <p className={styles.countTextSkeleton}></p>
            </div>
          </div>
        </div>
        <p className={styles.captionSkeleton}></p>
        <p className={styles.captionSkeletonTwo}></p>
      </div>
    </div>
  );
};

export default PostItemSkeleton;
