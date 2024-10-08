import { useParams } from "react-router-dom";
import styles from "./PostDetailsPage.module.css";
import NavBar from "../../components/NavBar/NavBar";
import logo from "../../assets/images/jyronue-logo.svg";

const PostDetailsPage = () => {
  const { postid } = useParams();

  return (
    <>
      <header>
        <NavBar />
      </header>
      <main className={styles.mainWrapper}>
        <div className={styles.postImages}></div>
        <div className={styles.postData}>
          <div className={styles.postProfile}>
            <img className={styles.postUserProfile} src={logo}></img>
            <div className={styles.postProfileItem}>
              <p className={styles.displayName}>Display name</p>
              <p className={styles.username}>@Username</p>
            </div>
          </div>
          <p>This is the post caption</p>
          <div className={styles.interactionInfo}>
            <div className={styles.interactionButtons}>
              <button className={styles.like}></button>
              <button className={styles.reply}></button>
            </div>
            <p className={styles.likeInfo}>
              <span className={styles.likeNumber}>663</span> likes
            </p>
          </div>
          <div className={styles.comments}>
            <p>Comments</p>
            <div className={styles.comment}>
              <div className={styles.commentProfile}>
                <img className={styles.commentUserProfile} src={logo}></img>
                <div className={styles.commentProfileInfo}>
                  <p className={styles.commentDisplayName}>Display name</p>
                  <p className={styles.commentUsername}>@Username</p>
                </div>
              </div>
              <p className={styles.commentText}>This is the comment Content</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default PostDetailsPage;
