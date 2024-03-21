import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import API_BASE_URL from "../../apiConfig";

const DeleteLombardForm = () => {
  const [lombards, setLombards] = useState([]);
  const [selectedLombard, setSelectedLombard] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLombards = async () => {
      try {
        const accessToken = Cookies.get("accessToken");
        const response = await axios.get(`${API_BASE_URL}/api/Lombard/GetAll`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setLombards(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Ошибка при получении списка ломбардов:", error);
        setIsLoading(false);
      }
    };
    fetchLombards();
  }, []);

  const handleChange = (e) => {
    setSelectedLombard(e.target.value);
  };

  const handleDelete = async () => {
    try {
      const accessToken = Cookies.get("accessToken");
      await axios.delete(
        `${API_BASE_URL}/api/Lombard/Name?name=${selectedLombard}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("Ломбард успешно удален");
      // Можно добавить дополнительную логику для обновления списка ломбардов
    } catch (error) {
      console.error("Ошибка при удалении ломбарда:", error);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <select value={selectedLombard} onChange={handleChange}>
        <option value="">Выберите ломбард для удаления</option>
        {lombards.map((lombard) => (
          <option key={lombard.id} value={lombard.lombard_name}>
            {lombard.lombard_name}
          </option>
        ))}
      </select>
      <button onClick={handleDelete}>Удалить выбранный ломбард</button>
    </div>
  );
};

export default DeleteLombardForm;
