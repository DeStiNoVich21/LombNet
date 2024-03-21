import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import API_BASE_URL from "../../apiConfig";

const AddAdminForm = () => {
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    email: "",
    number: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = Cookies.get("accessToken");
      const response = await axios.post(
        `${API_BASE_URL}/api/Users/AddAdmin`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("Суперадмин успешно добавлен:", response.data);
      // Сбросить форму после успешного добавления
      setUserData({
        username: "",
        password: "",
        email: "",
        number: "",
      });
    } catch (error) {
      console.error("Ошибка при добавлении суперадмина:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        placeholder="Имя пользователя"
        value={userData.username}
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Пароль"
        value={userData.password}
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={userData.email}
        onChange={handleChange}
      />
      <input
        type="text"
        name="number"
        placeholder="Номер телефона"
        value={userData.number}
        onChange={handleChange}
      />
      <button type="submit">Добавить суперадмина</button>
    </form>
  );
};

export default AddAdminForm;
