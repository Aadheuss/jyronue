import styles from "./NavBar.module.css";
import { Link } from "react-router-dom";
import logo from "../../assets/images/jyronue-logo.svg";
import { FC, useContext, useState } from "react";
import { UserContext } from "../../context/context";
import CreatePostModal from "../CreatePostModal/CreatePostModal";

interface Props {
  activeNavButton?: null | number;
}

const NavBar: FC<Props> = ({ activeNavButton = null }) => {
  const { user, setUser } = useContext(UserContext);
  const [openModal, setOpenModal] = useState<null | (() => void)>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const logout = async () => {
    try {
      const res = await fetch("http://localhost:3000/user/logout", {
        method: "GET",
        credentials: "include",
      });

      const resData = await res.json();
      console.log(resData);

      if (resData.error) {
        console.log(resData.error);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.log(err);
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
                    src={user.profileImage.pictureUrl}
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
                    Log out
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
