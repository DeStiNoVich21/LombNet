import { useState } from "react";
import PropTypes from "prop-types";
import API_BASE_URL from "../../apiConfig";
import Cookies from "js-cookie";

const AddProduct = ({ onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: 0,
    brand: "",
    image: null,
  });

  const categories = ["telephone", "laptop", "tablet", "headphones"];
  const brands = ["Iphone", "Samsung", "Xiaomi", "OPPO", "Nokia"];

  const [categoryError, setCategoryError] = useState(false);

  const token = Cookies.get("authToken");

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category) {
      setCategoryError(true);
      return;
    }

    try {
      const formDataToSend = new FormData();

      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      const response = await fetch(`${API_BASE_URL}/api/Fuji/addProduct`, {
        method: "POST",
        body: formDataToSend,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log("Product added successfully!");

        // Обновляем страницу
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
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={categoryError ? styles.selectError : ""}
          style={styles.input}
        >
          <option value="" disabled>
            Выберите категорию
          </option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
        {categoryError && (
          <p style={styles.error}>Пожалуйста, выберите категорию.</p>
        )}
      </label>
      <label style={styles.label}>
        Бренд:
        <select
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="" disabled>
            Выберите бренд
          </option>
          {brands.map((brand, index) => (
            <option key={index} value={brand}>
              {brand}
            </option>
          ))}
        </select>
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
          onChange={handleChange}
          style={styles.input}
          required
        />
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
    marginRight: "10px", // Добавим небольшое отступание справа
  },
  buttonHover: {
    backgroundColor: "#0056b3",
  },
  error: {
    color: "#dc3545",
    marginBottom: "10px",
  },
  fileInputContainer: {
    position: "relative",
    display: "inline-block",
    width: "32px",
    height: "32px",
    backgroundColor: "#007bff",
    color: "#fff",
    borderRadius: "4px",
    lineHeight: "32px",
    textAlign: "center",
    cursor: "pointer",
  },
  fileInputLabel: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    cursor: "pointer",
  },
};

export default AddProduct;
