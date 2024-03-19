import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import API_BASE_URL from "../../apiConfig";
import { useUser } from "../../components/UserContext";
import styles from "./Login.module.css";

const Login = () => {
  const [userData, setUserData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();
  const { loginUser, isLoggedIn } = useUser();
  const [error, setError] = useState(null);

  useEffect(() => {
    // Проверка наличия токена аутентификации в Cookies при загрузке страницы
    const authToken = Cookies.get("authToken");
    if (authToken && !isLoggedIn) {
      // Если токен существует и пользователь не вошел в систему, автоматически войти
      autoLogin(authToken);
    }
  }, [isLoggedIn]);

  const autoLogin = async (authToken) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/Authorization/AutoLogin`,
        null,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data.success) {
        console.log("Автоматический вход выполнен успешно");
        loginUser(response.data.user);
        navigate("/");
      } else {
        console.error("Ошибка автоматического входа:", response.data.error);
        // Удалить недействительный токен из Cookies
        Cookies.remove("authToken");
      }
    } catch (error) {
      console.error("Ошибка автоматического входа:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    try {
      if (!userData.username || !userData.password) {
        throw new Error("Имя пользователя и пароль обязательны для входа.");
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/Authorization/Login`,
        userData
      );

      const encodedJwt = response.data.encodedJwt;

      if (!encodedJwt) {
        throw new Error("Токен аутентификации отсутствует в ответе сервера.");
      }

      Cookies.set("authToken", encodedJwt, { expires: 7 });

      console.log("Вход выполнен успешно");

      loginUser(response.data);

      navigate("/");
    } catch (error) {
      console.error("Ошибка входа", error);
      setError(
        "Ошибка входа. Пожалуйста, проверьте правильность введенных данных."
      );
    }
  };

  return (
    <div className={styles.container}>
      <h1>Войти</h1>
      <form className={styles.form}>
        <label className={styles.label}>
          Имя:
          <input
            type="text"
            name="username"
            value={userData.username}
            onChange={handleInputChange}
            className={styles.input}
          />
        </label>
        <br />
        <label className={styles.label}>
          Пароль:
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleInputChange}
            className={styles.input}
          />
        </label>
        <br />
        <button type="button" onClick={handleLogin} className={styles.button}>
          Войти
        </button>
      </form>
      <p>
        Или вы можете зарегистрироваться{" "}
        <Link to="/registration" className={styles.link}>
          здесь
        </Link>
        .
      </p>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default Login;
