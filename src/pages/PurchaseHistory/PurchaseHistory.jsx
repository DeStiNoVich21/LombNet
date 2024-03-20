import { useState, useEffect } from "react";
import axios from "axios"; // Импортируем axios для выполнения HTTP-запросов
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import styles from "./PurchaseHistory.module.css";

const PurchaseHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const accessToken = Cookies.get("accessToken"); // Получаем токен доступа из куки

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7211/api/TransactionHistory/GetMyTransactions?id=UserId%3A%20${getUserIdFromToken()}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setTransactions(response.data);
      } catch (error) {
        console.error("Ошибка при получении истории покупок:", error);
      }
    };

    fetchPurchaseHistory();
  }, []); // Выполняем запрос только при загрузке компонента

  const getUserIdFromToken = () => {
    try {
      const decodedToken = jwtDecode(accessToken);
      return decodedToken["UserId"];
    } catch (error) {
      console.error("Ошибка декодирования токена:", error);
      return null;
    }
  };

  return (
    <div className={styles.purchaseHistory}>
      <h2>История покупок</h2>
      {transactions.length > 0 ? (
        <ul>
          {transactions.map((transaction) => (
            <li key={transaction.id}>
              <div>Название продукта: {transaction.productName}</div>
              <div>Дата покупки: {transaction.purchaseDate}</div>
              <div>Цена: {transaction.price}</div>
              {/* Другие данные о транзакции */}
            </li>
          ))}
        </ul>
      ) : (
        <p>У вас пока нет покупок.</p>
      )}
    </div>
  );
};

export default PurchaseHistory;
