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
      const token = Cookies.get("accessToken"); // Извлекаем токен из куки
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
    <form style={styles.form}>
      <h2 style={styles.heading}>Добавить ломбард</h2>
      <label style={styles.label}>
        Название:
        <input
          type="text"
          name="name"
          value={lombardData.name}
          onChange={handleInputChange}
          style={styles.input}
        />
      </label>
      <br />
      <label style={styles.label}>
        Адрес:
        <input
          type="text"
          name="address"
          value={lombardData.address}
          onChange={handleInputChange}
          style={styles.input}
        />
      </label>
      <br />
      <label style={styles.label}>
        Номер:
        <input
          type="text"
          name="number"
          value={lombardData.number}
          onChange={handleInputChange}
          style={styles.input}
        />
      </label>
      <br />
      <button type="button" onClick={handleAddLombard} style={styles.button}>
        Добавить ломбард
      </button>
    </form>
  );
};

const styles = {
  form: {
    maxWidth: "400px",
    margin: "0 auto",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "10px",
  },
  input: {
    width: "100%",
    padding: "8px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxSizing: "border-box",
    marginBottom: "10px",
  },
  button: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
};

export default AddLombardForm;
