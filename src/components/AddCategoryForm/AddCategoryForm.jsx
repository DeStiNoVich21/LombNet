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
    <form onSubmit={handleSubmit}>
      {errorMessage && <p>{errorMessage}</p>}
      <label>
        Name:
        <input type="text" value={name} onChange={handleNameChange} required />
      </label>
      <label>
        Category:
        <input
          type="text"
          value={category}
          onChange={handleCategoryChange}
          required
        />
      </label>
      <label>
        Image:
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
        />
      </label>
      <button type="submit">Добавить категорию</button>
    </form>
  );
};

AddCategoryForm.propTypes = {
  onCategoryAdded: PropTypes.func.isRequired,
};

export default AddCategoryForm;
