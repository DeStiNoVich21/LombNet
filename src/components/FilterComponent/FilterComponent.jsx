import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./FilterComponent.module.css"; // Импортируем стили

const FilterComponent = ({ onFilterChange, brands }) => {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);

  const handleFilter = () => {
    let filterParams = "";

    // Фильтрация по брендам
    if (selectedBrands.length > 0) {
      filterParams += `brands=${selectedBrands.join(",")}`;
    }

    // Фильтрация по цене
    if (minPrice && maxPrice) {
      filterParams += `&minPrice=${minPrice}&maxPrice=${maxPrice}`;
    }

    onFilterChange(filterParams);
  };

  const handleBrandChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setSelectedBrands((prevSelectedBrands) => [...prevSelectedBrands, value]);
    } else {
      setSelectedBrands((prevSelectedBrands) =>
        prevSelectedBrands.filter((brand) => brand !== value)
      );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.price}>
        <h3>Цена, ₸</h3>
        <div className={styles.priceItem}>
          <input
            className={styles.priceInput}
            placeholder="От:"
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>
        <div className={styles.priceItem}>
          <input
            className={styles.priceInput}
            placeholder="До:"
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>
      <div>
        <h3>Бренд</h3>
        {brands.map(
          (brand, index) =>
            brand && (
              <div key={index} className={styles.brand}>
                <input
                  className={styles.brandCheckbox}
                  type="checkbox"
                  id={`brand-${index}`}
                  name={`brand-${index}`}
                  value={brand}
                  checked={selectedBrands.includes(brand)}
                  onChange={handleBrandChange}
                />
                <label htmlFor={`brand-${index}`}>{brand}</label>
              </div>
            )
        )}
      </div>
      <button className={styles.applyButton} onClick={handleFilter}>
        Применить фильтр
      </button>
    </div>
  );
};

FilterComponent.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  brands: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default FilterComponent;
