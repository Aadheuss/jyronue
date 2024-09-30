import styles from "./ErrorPage.module.css";
import img from "../../assets/images/error_icon.svg";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <main className={styles.container}>
        <div className={styles.icon}>
          <img src={img} alt="" />
        </div>
        <p className={styles.txtMain}>Something went wrong!</p>
        <p className={styles.txt}> failed to connect to the server </p>
        <button
          className={styles.btn}
          type="button"
          onClick={() => navigate(-1)}
        >
          Go back
        </button>
      </main>
    </div>
  );
};

export default ErrorPage;
