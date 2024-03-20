import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import styles from "./Header.module.css";

const Header = () => {
  const { user, logoutUser } = useUser();
  const [userId, setUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      try {
        const decodedToken = jwtDecode(accessToken);
        const userIdFromToken = decodedToken["UserId"];
        setUserId(userIdFromToken);
        const userRole =
          decodedToken[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ];
        setIsAdmin(userRole === "Moderator");
        setIsUser(userRole === "User");
      } catch (error) {
        console.error("Ошибка декодирования токена:", error);
      }
    }
  }, [user]);

  const handleLogout = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const handleLogoutClick = () => {
    Cookies.remove("accessToken");
    logoutUser();
    setIsAdmin(false);
    setIsUser(false);
    setIsPanelOpen(false);
    navigate("/");
  };

  const isLoggedIn = !!user && !!userId;

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        <img src="logo.svg" alt="" className={styles.logoImage} />
        <div>LombNet</div>
      </Link>
      <div className={styles.menu}>
        {isLoggedIn && (
          <div className={styles.userInfo}>
            <a onClick={handleLogout} className={styles.logout}>
              Мой кабинет
            </a>
            {isPanelOpen && (
              <div className={styles.panel}>
                {isUser && (
                  <Link to="/purchase-history" className={styles.panelLink}>
                    Мои покупки
                  </Link>
                )}
                {isAdmin && (
                  <Link to="/admin" className={styles.panelLink}>
                    Панель администратора
                  </Link>
                )}
                <button
                  onClick={handleLogoutClick}
                  className={styles.panelButton}
                >
                  Выйти из аккаунта
                </button>
              </div>
            )}
          </div>
        )}
        {!isLoggedIn && (
          <Link to="/login">
            <button className={styles.login}>Войти</button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
