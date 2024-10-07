import styles from "./NavBar.module.css";
import { Link } from "react-router-dom";
import logo from "../../assets/images/jyronue-logo.svg";

const NavBar = () => {
  return (
    <nav className={styles.navBar}>
      <Link className={styles.link} to="/">
        <img className={styles.logo} src={logo} alt="Jyronue-logo" />
      </Link>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link className={styles.link} to="/login">
            Log in
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link className={styles.link} to="/signup">
            Sign up
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
