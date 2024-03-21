import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import API_BASE_URL from "../../apiConfig";

const AddModeratorForm = () => {
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    email: "",
    number: "",
    lombardName: "",
  });
  const [lombards, setLombards] = useState([]);

  useEffect(() => {
    const fetchLombards = async () => {
      try {
        const accessToken = Cookies.get("accessToken");
        const response = await axios.get(`${API_BASE_URL}/api/Lombard/GetAll`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setLombards(response.data);
      } catch (error) {
        console.error("Ошибка при получении списка ломбардов:", error);
      }
    };
    fetchLombards();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = Cookies.get("accessToken"); // Получение токена доступа из куки
      const response = await axios.post(
        `${API_BASE_URL}/api/Users/AddMod`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Отправка токена доступа в заголовке
          },
        }
      );
      console.log("Модератор успешно добавлен:", response.data);
      // Сбросить форму после успешного добавления
      setUserData({
        username: "",
        password: "",
        email: "",
        number: "",
        lombardName: "",
      });
    } catch (error) {
      console.error("Ошибка при добавлении модератора:", error);
    }
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
      <select name="lombardName" onChange={handleChange}>
        <option value="">Выберите ломбард</option>
        {lombards.map((lombard, index) => (
          <option key={index} value={lombard.lombard_name}>
            {lombard.lombard_name}
          </option>
        ))}
      </select>
      <button type="submit">Добавить модератора</button>
    </form>
  );
};

export default AddModeratorForm;
