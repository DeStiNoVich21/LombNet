import styles from "../Header/Header.module.css";
import { Link } from "react-router-dom";
import { useUser } from "../UserContext";

const Header = () => {
  const { user, logoutUser } = useUser();

  const handleLogout = () => {
    logoutUser();
  };

  return (
    <>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          <img src="logo.svg" alt="" className={styles.logoImage} />
          <div>LombNet</div>
        </Link>
        <Link to="/admin">
          <div>Admin</div>
        </Link>
        {user ? (
          <>
            <span>{user.username}</span>
            <button onClick={handleLogout}>Выйти</button>
          </>
        ) : (
          <Link to="/login">
            <button className={styles.login}>Войти</button>
          </Link>
        )}
      </header>
    </>
  );
};

export default Header;
