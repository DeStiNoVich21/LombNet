import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie"; // Импортируем модуль для работы с куками
import API_BASE_URL from "../../apiConfig";

const AddLombardForm = ({ onLombardAdded }) => {
  const [lombardData, setLombardData] = useState({
    name: "",
    address: "",
    number: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLombardData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddLombard = async () => {
    try {
      const token = Cookies.get("authToken"); // Извлекаем токен из куки
      const response = await axios.post(
        `${API_BASE_URL}/api/lombard/addLombard`,
        lombardData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Передаем токен в заголовке запроса
          },
        }
      );
      console.log("Lombard added successfully:", response.data);
      // Очищаем поля после успешного добавления
      setLombardData({
        name: "",
        address: "",
        number: "",
      });
      // Вызываем функцию обратного вызова, чтобы сообщить родительский компонент об успешном добавлении
      if (onLombardAdded) {
        onLombardAdded();
      }
    } catch (error) {
      console.error("Error adding lombard:", error);
      if (error.response.status === 401) {
        console.error("Ошибка аутентификации: Вам необходимо войти в систему.");
      }
    }
  };

  return (
    <div>
      <h2>Add Lombard</h2>
      <form>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={lombardData.name}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Address:
          <input
            type="text"
            name="address"
            value={lombardData.address}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Number:
          <input
            type="text"
            name="number"
            value={lombardData.number}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <button type="button" onClick={handleAddLombard}>
          Add Lombard
        </button>
      </form>
    </div>
  );
};

export default AddLombardForm;
