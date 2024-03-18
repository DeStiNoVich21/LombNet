import { jwtDecode, InvalidTokenError } from "jwt-decode"; // Импортируем необходимые функции для декодирования JWT токена
import styles from "../Header/Header.module.css";
import { Link } from "react-router-dom";
import { useUser } from "../UserContext";

const Header = () => {
  const { user, logoutUser } = useUser();

  const handleLogout = () => {
    logoutUser();
  };

  let isAdmin = false;

  // Проверяем, залогинен ли пользователь и содержит ли его токен информацию о роли
  if (user && user.encodedJwt) {
    try {
      // Декодируем JWT токен
      const decodedToken = jwtDecode(user.encodedJwt);

      // Выводим содержимое декодированного токена в консоль
      console.log("Decoded JWT Token:", decodedToken);

      // Проверяем роль пользователя
      isAdmin =
        decodedToken[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] === "Moderator";
      console.log(decodedToken.role);
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
          {isAdmin && ( // Показываем ссылку на админ-панель только для модераторов
            <Link to="/admin" className={styles.adminLink}>
              <div>Понель администратора</div>
            </Link>
          )}
          {user ? (
            <>
              <span>{user.username}</span>
              <button onClick={handleLogout} className={styles.logout}>
                Выйти
              </button>
            </>
          ) : (
            <Link to="/login">
              <button className={styles.login}>Войти</button>
            </Link>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
