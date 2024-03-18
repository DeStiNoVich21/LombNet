import { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import API_BASE_URL from "../../apiConfig";
import Cookies from "js-cookie";

const AddCategoryForm = ({ onCategoryAdded }) => {
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [token] = useState(Cookies.get("authToken"));

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("category", category);
      formData.append("name", name);
      formData.append("image", image);

      await axios.post(
        `${API_BASE_URL}/api/Fuji/addProductWithCategoryAndImage`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Очистить форму после успешной отправки
      setCategory("");
      setName("");
      setImage(null);
      setErrorMessage("");
      alert("Категория успешно добавлена!");

      // Вызов функции обратного вызова для обновления информации после добавления категории
      if (typeof onCategoryAdded === "function") {
        onCategoryAdded();
      }
    } catch (error) {
      setErrorMessage("Произошла ошибка при добавлении категории.");
      console.error("Ошибка при добавлении категории:", error);
    }
  };

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      {errorMessage && <p style={styles.error}>{errorMessage}</p>}
      <h2 style={styles.heading}>Добавление категории</h2>
      <label style={styles.label}>
        Название:
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          style={styles.input}
          required
        />
      </label>
      <label style={styles.label}>
        Категория:
        <input
          type="text"
          value={category}
          onChange={handleCategoryChange}
          style={styles.input}
          required
        />
      </label>
      <label style={styles.label}>
        Картинка:
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={styles.input}
          required
        />
      </label>
      <button type="submit" style={styles.button}>
        Добавить категорию
      </button>
    </form>
  );
};

AddCategoryForm.propTypes = {
  onCategoryAdded: PropTypes.func.isRequired,
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
  },
  error: {
    color: "#dc3545",
    marginBottom: "10px",
  },
};

export default AddCategoryForm;
