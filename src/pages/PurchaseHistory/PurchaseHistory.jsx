import { useState, useEffect } from "react";
import axios from "axios"; // Импортируем axios для выполнения HTTP-запросов
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import styles from "./PurchaseHistory.module.css";
import Header from "../../components/Header/Header";
import API_BASE_URL from "../../apiConfig";

const PurchaseHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const accessToken = Cookies.get("accessToken"); // Получаем токен доступа из куки

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/TransactionHistory/GetMyTransactions?id=UserId%3A%20${getUserIdFromToken()}`,
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
    <>
      <Header />
      <div className={styles.purchaseHistory}>
        <h2 className={styles.heading}>История покупок</h2>
        {transactions.length > 0 ? (
          <ul className={styles.transactionList}>
            {transactions.map((transaction) => (
              <li key={transaction.id} className={styles.transaction}>
                <div className={styles.transactionStatus}>
                  {transaction.status}
                </div>{" "}
                {/* Блок для отображения статуса товара */}
                <div>Название продукта: {transaction.productName}</div>
                <div>Цена: {transaction.price}</div>
                {/* Другие данные о транзакции */}
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.noTransactions}>У вас пока нет покупок.</p>
        )}
      </div>
    </>
  );
};

export default PurchaseHistory;
