import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_BASE_URL from "../../apiConfig";

const ProductDetailsPage = () => {
  const { id, imageFileName } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/Fuji/product/${id}`);

        if (response.ok) {
          const data = await response.json();
          setProduct(data);
          setError(null); // Сбрасываем ошибку, если запрос успешный
        } else {
          setError("Failed to fetch product details.");
        }
      } catch (error) {
        console.error("Error:", error);
        setError(error.message); // Устанавливаем текст ошибки
      }
    };

    fetchProductDetails();
  }, [id]);

  if (error) {
    return <div>Error: {error}</div>; // Отображаем сообщение об ошибке
  }

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{product.name}</h2>
      <p>Цена: {product.price}</p>
      <p>Описание: {product.description}</p>
      {imageFileName && (
        <img
          src={`${API_BASE_URL}/api/Fuji/getImage/${imageFileName}`}
          alt={product.name}
        />
      )}
    </div>
  );
};

export default ProductDetailsPage;
