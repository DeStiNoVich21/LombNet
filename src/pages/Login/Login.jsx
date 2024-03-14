import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useUser } from "../../components/UserContext";
import styles from "./Login.module.css";
import Cookies from "js-cookie";
import API_BASE_URL from "../../apiConfig";

const Login = () => {
  const [userData, setUserData] = useState({
    username: "",
    password: "",
  });

  const { loginUser } = useUser();
  const navigate = useNavigate();

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
        console.error("Имя пользователя и пароль обязательны для входа.");
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/Authorization/Login`,
        userData
      );

      const encodedJwt = response.data.encodedJwt; // Получаем токен из ответа

      if (!encodedJwt) {
        console.error("Токен аутентификации отсутствует в ответе сервера.");
        return;
      }

      Cookies.set("authToken", encodedJwt, { expires: 7 }); // Храним токен в куки на 7 дней

      console.log("Вход выполнен успешно");

      loginUser(response.data);

      navigate("/");
    } catch (error) {
      console.error("Ошибка входа", error);

      alert(
        "Ошибка входа. Пожалуйста, проверьте правильность введенных данных."
      );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
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
          Или вы можете{" "}
          <Link to="/registration" className={styles.link}>
            зарегистрироваться
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default Login;
