import styles from "./NavBar.module.css";
import { Link } from "react-router-dom";
import logo from "../../assets/images/jyronue-logo.svg";
import { FC, useContext, useState } from "react";
import { UserContext } from "../../context/context";
import CreatePostModal from "../CreatePostModal/CreatePostModal";
import avatar from "../../assets/images/avatar_icon.svg";
import Loader from "../Loader/Loader";
const domain = import.meta.env.VITE_DOMAIN;

interface Props {
  activeNavButton?: null | number;
}

const NavBar: FC<Props> = ({ activeNavButton = null }) => {
  const { user, setUser } = useContext(UserContext);
  const [openModal, setOpenModal] = useState<null | (() => void)>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const logout = async () => {
    setIsSubmitting(true);

    try {
      const logout = await fetch(`${domain}/user/logout`, {
        mode: "cors",
        method: "GET",
        credentials: "include",
      });

      const logoutData = await logout.json();

      if (logoutData.error) {
        console.log(`${logoutData.error.message}: ${logoutData.error.error}`);
      } else {
        console.log(`${logoutData.message}`);
        setUser(false);
      }
    } catch (err) {
      console.log(`Something went wrong!: Logout`);
      if (err instanceof TypeError) console.log(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <nav className={styles.navBar}>
        <div className={styles.itemContainer}>
          <Link className={styles.link} to="/">
            <img className={styles.logo} src={logo} alt="Jyronue-logo" />
          </Link>
          <div
            className={
              activeNavButton === 1 ? styles.activeNavItem : styles.navItem
            }
          >
            <Link className={styles.exploreLink} to="/explore">
              Explore
            </Link>
          </div>
        </div>

        <ul className={styles.navList}>
          {user ? (
            <>
              <li className={styles.navItemCreate}>
                <button
                  className={styles.createPostButton}
                  onClick={() => {
                    if (openModal) {
                      openModal();
                    }
                  }}
                >
                  Create
                </button>
              </li>
              <li className={styles.menuNavItem}>
                <button
                  className={styles.userProfileAvatar}
                  type="button"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <img
                    className={styles.avatar}
                    src={user.profileImage.pictureUrl || avatar}
                    alt="Your avatar image"
                  ></img>
                </button>
              </li>
              <ul className={isMenuOpen ? styles.menu : styles.hidden}>
                <li className={styles.menuItem}>
                  <Link
                    className={
                      activeNavButton === 2
                        ? styles.activeMenuChild
                        : styles.menuChild
                    }
                    to={`/profile/${user.username}`}
                  >
                    Your Profile
                  </Link>
                </li>
                <li className={styles.menuItem}>
                  <Link
                    className={
                      activeNavButton === 3
                        ? styles.activeMenuChild
                        : styles.menuChild
                    }
                    to={`/`}
                  >
                    Home
                  </Link>
                </li>
                <li className={styles.menuItem}>
                  <button
                    className={styles.menuChild}
                    type="button"
                    onClick={logout}
                  >
                    {isSubmitting ? "Logging out" : "Log out"}
                    {isSubmitting && (
                      <Loader
                        type="dots"
                        size={{ height: "0.2em", width: "1.5em" }}
                        color="var(--main-color-2)"
                      />
                    )}
                  </button>
                </li>
              </ul>
            </>
          ) : (
            <>
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
            </>
          )}
        </ul>
      </nav>
      {user && <CreatePostModal setOpenModal={setOpenModal} />}
    </>
  );
};

export default NavBar;
