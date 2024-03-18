import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import styles from "../Header/Header.module.css";
import { Link } from "react-router-dom";
import { useUser } from "../UserContext";
import Modal from "../Modal/Modal"; // Путь к компоненту модального окна

const Header = () => {
  const { user, logoutUser } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  let isAdmin = false;

  if (user && user.encodedJwt) {
    try {
      const decodedToken = jwtDecode(user.encodedJwt);
      isAdmin =
        decodedToken[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] === "Moderator";
    } catch (error) {
      console.error("Ошибка декодирования токена:", error);
    }
  }

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
          {isAdmin && (
            <Link to="/admin" className={styles.adminLink}>
              <div>Панель администратора</div>
            </Link>
          )}
          {user ? (
            <>
              <span>{user.username}</span>
              <button onClick={handleLogout} className={styles.logout}>
                Мой кабинет
              </button>
            </>
          ) : (
            <Link to="/login">
              <button className={styles.login}>Войти</button>
            </Link>
          )}
        </div>
      </header>
      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <div>
            {/* Добавляем ссылку на страницу истории покупок */}
            <Link to="/purchase-history">Мои покупки</Link>
            {/* Добавляем функцию закрытия модального окна при нажатии на кнопку */}
            <button
              onClick={() => {
                logoutUser();
                handleCloseModal();
              }}
            >
              Выйти из аккаунта
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Header;
