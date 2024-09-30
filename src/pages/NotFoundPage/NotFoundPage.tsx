import { Link } from "react-router-dom";
import styles from "./NotFoundPage.module.css";

const NotFoundPage = () => {
  return (
    <div className={styles.wrapper}>
      <main className={styles.container}>
        <p className={styles.headerTxt}>404</p>
        <p className={styles.txtMain}>Page not found</p>
        <p className={styles.txt}>
          The Page you are looking for doesn&#039;t exist.{" "}
        </p>
        <Link className={styles.link} to="/">
          Go back to Homepage
        </Link>
      </main>
    </div>
  );
};

export default NotFoundPage;
