import { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import API_BASE_URL from "../../apiConfig";
import Cookies from "js-cookie";

const AddProduct = ({ onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: 0,
    status: "In_stock",
    brand: "",
  });

  const [image, setImage] = useState(null); // Отдельный стейт для изображения
  const [categoryError, setCategoryError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [token] = useState(Cookies.get("authToken"));

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Обновляем состояние изображения при его изменении
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category) {
      setCategoryError(true);
      return;
    }

    if (!image) {
      setImageError(true);
      return;
    }

    try {
      const formDataToSend = new FormData();

      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      formDataToSend.append("image", image); // Добавляем изображение к данным для отправки

      const response = await axios.post(
        `${API_BASE_URL}/api/Fuji/addProduct`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Product added successfully!");
        onProductAdded(formData.name);
        window.location.reload();
      } else if (response.status === 401) {
        console.error("Unauthorized. Check if the token is valid.");
      } else {
        const errorText = await response.text();
        console.error(`Failed to add product. Server response: ${errorText}`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      <h2>Добавление товара</h2>
      <label style={styles.label}>
        Название:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          style={styles.input}
        />
      </label>
      <label style={styles.label}>
        Категория:
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={categoryError ? styles.selectError : ""}
          style={styles.input}
        />
        {categoryError && (
          <p style={styles.error}>Пожалуйста, выберите категорию.</p>
        )}
      </label>
      <label style={styles.label}>
        Бренд:
        <input
          type="text"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          style={styles.input}
        />
      </label>
      <label style={styles.label}>
        Описание:
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          style={styles.input}
        />
      </label>
      <label style={styles.label}>
        Цена:
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          style={styles.input}
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
        {imageError && (
          <p style={styles.error}>Пожалуйста, выберите изображение.</p>
        )}
      </label>
      <button type="submit" style={styles.button}>
        Добавить товар
      </button>
    </form>
  );
};

AddProduct.propTypes = {
  onProductAdded: PropTypes.func.isRequired,
};

const styles = {
  form: {
    maxWidth: "400px",
    margin: "0 auto",
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
  selectError: {
    borderColor: "#dc3545",
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
    marginRight: "10px",
  },
  error: {
    color: "#dc3545",
    marginBottom: "10px",
  },
};

export default AddProduct;
