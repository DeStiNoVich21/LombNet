import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
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
  const { loginUser } = useUser();
  const [error, setError] = useState(null);

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

      console.log("Отправка запроса на вход:", userData);

      const response = await axios.post(
        `${API_BASE_URL}/api/Authorization/Login`,
        userData
      );

      const { refreshJwt } = response.data;

      if (!refreshJwt) {
        throw new Error("refreshJwt отсутствует в ответе сервера.");
      }

      Cookies.set("refreshJwt", refreshJwt, { expires: 7 });

      console.log("Вход выполнен успешно");

      const refreshTokenResponse = await axios.get(
        `${API_BASE_URL}/api/Authorization/refresh-token?refreshToken=${refreshJwt}`
      );

      const { accessToken } = refreshTokenResponse.data;

      if (!accessToken) {
        throw new Error("accessToken отсутствует в ответе сервера.");
      }

      Cookies.set("accessToken", accessToken, { expires: 7 });

      loginUser({ username: userData.username, accessToken }); // Передаем объект пользователя с accessToken

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
