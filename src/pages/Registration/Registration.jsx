import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Registration.module.css";
import API_BASE_URL from "../../apiConfig";

const Registration = () => {
  const [userData, setUserData] = useState({
    username: "",
    number: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState(""); // Состояние для хранения ошибки

  const navigate = useNavigate(); // Используем useNavigate для программной навигации

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRegistration = async () => {
    if (
      !userData.username ||
      !userData.number ||
      !userData.email ||
      !userData.password
    ) {
      setError("Все поля должны быть заполнены."); // Устанавливаем ошибку
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/api/Authorization/Registration`,
        userData
      );
      // При успешной регистрации перенаправляем пользователя на страницу входа
      navigate("/login");
    } catch (error) {
      console.error("Ошибка регистрации:", error);
      setError("Произошла ошибка во время регистрации."); // Устанавливаем ошибку
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.registrationContainer}>
        <h1 className={styles.registrationTitle}>Регистрация</h1>
        <form className={styles.registrationForm}>
          <label className={styles.formLabel}>
            Имя:
            <input
              type="text"
              name="username"
              onChange={handleInputChange}
              className={styles.input}
            />
          </label>
          <br />
          <label className={styles.formLabel}>
            Номер телефона:
            <input
              type="tel"
              name="number"
              onChange={handleInputChange}
              className={styles.input}
            />
          </label>
          <br />
          <label className={styles.formLabel}>
            Email:
            <input
              type="email"
              name="email"
              onChange={handleInputChange}
              className={styles.input}
            />
          </label>
          <br />
          <label className={styles.formLabel}>
            Пароль:
            <input
              type="password"
              name="password"
              onChange={handleInputChange}
              className={styles.input}
            />
          </label>
          <br />
          <button
            type="button"
            onClick={handleRegistration}
            className={styles.button}
          >
            Зарегистрироваться
          </button>
          {/* Отображаем ошибку, если она есть */}
          {error && <div className={styles.error}>{error}</div>}
        </form>
        <div className="log">
          Уже есть аккаунт? <Link to="/login">Войти</Link>.
        </div>
      </div>
    </div>
  );
};

export default Registration;
