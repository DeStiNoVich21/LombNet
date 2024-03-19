import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Cookies from "js-cookie";

export const UserContext = createContext(); // Создаем контекст пользователя

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Состояние пользователя

  useEffect(() => {
    // При загрузке приложения пытаемся получить пользователя из cookie
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      // Если accessToken есть в cookie, устанавливаем его в состояние пользователя
      setUser({ accessToken });
    }
  }, []); // Зависимость пустая, чтобы эффект выполнялся только один раз

  const loginUser = (userData) => {
    // Функция для установки пользователя
    setUser(userData);
    Cookies.set("accessToken", userData.accessToken, { expires: 7 }); // Сохраняем accessToken в cookie
  };

  const logoutUser = () => {
    // Функция для выхода пользователя
    Cookies.remove("accessToken"); // Удаляем accessToken из cookie
    setUser(null); // Устанавливаем пользователя в null
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useUser = () => useContext(UserContext); // Хук для использования контекста пользователя
