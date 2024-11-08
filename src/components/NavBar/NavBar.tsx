import styles from "./NavBar.module.css";
import { Link } from "react-router-dom";
import logo from "../../assets/images/jyronue-logo.svg";
import { useContext, useState } from "react";
import { UserContext } from "../../context/context";
import CreatePostModal from "../CreatePostModal/CreatePostModal";

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);
  const [openModal, setOpenModal] = useState<null | (() => void)>(null);

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
          <div className={styles.navItem}>
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
              <li className={styles.navItem}>
                <button
                  className={styles.logoutButton}
                  type="button"
                  onClick={logout}
                >
                  Log out
                </button>
              </li>
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
