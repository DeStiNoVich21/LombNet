import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import Modal from "../Modal/Modal";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import styles from "./Header.module.css";

const Header = () => {
  const { user, logoutUser } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUser, setIsUser] = useState(false); // Добавляем состояние для проверки на пользователя
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
        setIsUser(userRole === "User"); // Проверяем роль пользователя
      } catch (error) {
        console.error("Ошибка декодирования токена:", error);
      }
    }
  }, [user]);

  useEffect(() => {
    // При выходе из учетной записи сбрасываем состояние isAdmin и isUser
    if (!user) {
      setIsAdmin(false);
      setIsUser(false);
    }
  }, [user]);

  const handleLogout = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleLogoutClick = () => {
    Cookies.remove("accessToken");
    logoutUser();
    handleCloseModal();
    setIsAdmin(false); // Сбрасываем состояние isAdmin
    setIsUser(false); // Сбрасываем состояние isUser
    navigate("/");
  };

  const isLoggedIn = !!user && !!userId;

  return (
    <>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          <img src="logo.svg" alt="" className={styles.logoImage} />
          <div>LombNet</div>
        </Link>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            columnGap: "20px",
          }}
        >
          {isLoggedIn && (
            <>
              <span>{userId}</span>
              <button onClick={handleLogout} className={styles.logout}>
                Мой кабинет
              </button>
            </>
          )}
          {!isLoggedIn && (
            <Link to="/login">
              <button className={styles.login}>Войти</button>
            </Link>
          )}
        </div>
      </header>
      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <div>
            {isUser && ( // Проверяем, является ли пользователь пользователем
              <Link to="/purchase-history">Мои покупки</Link>
            )}
            {isAdmin && ( // Проверяем, является ли пользователь администратором
              <Link to="/admin" className={styles.adminLink}>
                <div>Панель администратора</div>
              </Link>
            )}
            <button onClick={handleLogoutClick}>Выйти из аккаунта</button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Header;
