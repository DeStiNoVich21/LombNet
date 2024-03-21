import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import styles from "./PurchaseHistory.module.css";
import Header from "../../components/Header/Header";
import API_BASE_URL from "../../apiConfig";

const PurchaseHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const accessToken = Cookies.get("accessToken");

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/TransactionHistory/GetMyTransactions/${getUserIdFromToken()}`,
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
  }, []);

  const getUserIdFromToken = () => {
    try {
      const decodedToken = jwtDecode(accessToken);
      return decodedToken["UserId"];
    } catch (error) {
      console.error("Ошибка декодирования токена:", error);
      return null;
    }
  };

  const cancelTransaction = async (transactionId) => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/TransactionHistory/CancelTransaction?id=${transactionId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      refreshTransactions();
    } catch (error) {
      console.error("Ошибка при отмене транзакции:", error);
    }
  };

  const completeTransaction = async (transactionId) => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/TransactionHistory/CompleteTransaction?id=${transactionId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      refreshTransactions();
    } catch (error) {
      console.error("Ошибка при завершении транзакции:", error);
    }
  };

  const refreshTransactions = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/TransactionHistory/GetMyTransactions/${getUserIdFromToken()}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setTransactions(response.data);
    } catch (error) {
      console.error("Ошибка при обновлении списка транзакций:", error);
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "InQue":
        return "В ожидании";
      case "Completed":
        return "Товар куплен";
      case "Rejected":
        return "Товар отменен";
      default:
        return "Неизвестный статус";
    }
  };

  return (
    <>
      <Header />
      <div className={styles.purchaseHistory}>
        <h2 className={styles.heading}>История покупок</h2>
        {transactions.length > 0 ? (
          <ul className={styles.transactionList}>
            {transactions.map((transaction, index) => (
              <li key={index} className={styles.transaction}>
                <div
                  className={`${styles.transactionStatus} ${
                    transaction[0].transaction.status === "InQue"
                      ? styles.pending
                      : transaction[0].transaction.status === "Completed"
                      ? styles.completed
                      : styles.rejected
                  }`}
                >
                  <span>
                    {getStatusText(transaction[0].transaction.status)}
                  </span>
                  {transaction[0].transaction.status === "InQue" && (
                    <div className={styles.buttonContainer}>
                      <button
                        className={`${styles.actionButton} ${styles.cancelButton}`}
                        onClick={() =>
                          cancelTransaction(transaction[0].transaction.id)
                        }
                      >
                        Отмена
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.buyButton}`}
                        onClick={() =>
                          completeTransaction(transaction[0].transaction.id)
                        }
                      >
                        Купить
                      </button>
                    </div>
                  )}
                </div>
                <div>Название продукта: {transaction[0].product.name}</div>
                <div>Цена: {transaction[0].product.price}</div>
                <div className={styles.lombardInfo}>
                  Ломбард: {transaction[0].lombard.lombard_name},{" "}
                  {transaction[0].lombard.address},{" "}
                  {transaction[0].lombard.number}
                </div>
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
