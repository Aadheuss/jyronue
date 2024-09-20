import styles from "./SignupPage.module.css";
import logo from "../../assets/images/jyronue-logo.svg";
import InputContainer from "../../components/InputContainer/InputContainer";

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
            <InputContainer
              id="username"
              autoComplete="username"
              label="Username"
            />
            <InputContainer
              id="password"
              type="password"
              autoComplete="new-password"
              label="Password"
            />
            <button type="submit">Sign up</button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default SignupPage;
