import { useState } from "react";
import PropTypes from "prop-types";

const FilterComponent = ({ onFilterChange }) => {
  const [brand, setBrand] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleFilter = () => {
    let filterParams = "";

    if (brand) {
      filterParams += `brand=${brand}`;
    }

    if (minPrice && maxPrice) {
      filterParams += `&minPrice=${minPrice}&maxPrice=${maxPrice}`;
    }

    onFilterChange(filterParams);
  };

  return (
    <div>
      <h3>Фильтр:</h3>
      <div>
        <label>Бренд:</label>
        <input
          type="text"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />
      </div>
      <div>
        <label>Минимальная цена:</label>
        <input
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
      </div>
      <div>
        <label>Максимальная цена:</label>
        <input
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>
      <button onClick={handleFilter}>Применить фильтр</button>
    </div>
  );
};

FilterComponent.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
};

export default FilterComponent;
