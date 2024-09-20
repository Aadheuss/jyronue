import styles from "./SignupPage.module.css";
import logo from "../../assets/images/jyronue-logo.svg";

const SignupPage = () => {
  return (
    <div className={styles.signupPageWrapper}>
      <main className={styles.main}>
        <div className={styles.imgContainer}>
          <img className={styles.logo} src={logo} alt="Jyronue-logo" />
        </div>
        <div className={styles.mainItem}>
          <div className={styles.greeting}>
            <h1 className={styles.h1}>Welcome to Jyronue</h1>
            <p className={styles.text}>Create an account to get started</p>
          </div>
          <form className={styles.signupForm}>
            <div className={styles.inputWrapper}>
              <label className={styles.label} htmlFor="username">
                Username
              </label>
              <input
                id="username"
                className={styles.input}
                type="text"
                autoComplete="username"
              />
            </div>
            <div className={styles.inputWrapper}>
              <label className={styles.label} htmlFor="password">
                Password
              </label>
              <input
                id="password"
                className={styles.input}
                type="password"
                autoComplete="new-password"
              />
            </div>
            <button type="submit">Sign up</button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default SignupPage;
