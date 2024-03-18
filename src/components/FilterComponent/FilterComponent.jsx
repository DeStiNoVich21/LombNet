import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./FilterComponent.module.css";

const FilterComponent = ({ onFilterChange, brands, selectedCategory }) => {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);

  // Обновляем выбранные бренды и цены при изменении параметров фильтра
  useEffect(() => {
    setSelectedBrands([]);
    setMinPrice("");
    setMaxPrice("");
  }, [selectedCategory]);

  const handleFilter = () => {
    let filterParams = {};

    if (selectedCategory) {
      filterParams["category"] = selectedCategory;
    }

    if (selectedBrands.length > 0) {
      filterParams["brand"] = selectedBrands.join(",");
    }

    if (minPrice && maxPrice) {
      filterParams["minPrice"] = parseInt(minPrice);
      filterParams["maxPrice"] = parseInt(maxPrice);
    }

    const queryParams = new URLSearchParams(filterParams).toString();

    console.log("Filter Params:", filterParams);
    console.log("Query URL:", queryParams);

    onFilterChange(queryParams);
  };

  const handleBrandChange = (e) => {
    const brand = e.target.value;
    const isChecked = e.target.checked;

    if (isChecked) {
      setSelectedBrands([...selectedBrands, brand]);
    } else {
      setSelectedBrands(
        selectedBrands.filter((selectedBrand) => selectedBrand !== brand)
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
        {brands
          .filter((brand) => brand)
          .map((brand, index) => (
            <div key={index} className={styles.checkboxContainer}>
              <input
                type="checkbox"
                id={`brand_${index}`} // Уникальный идентификатор
                value={brand}
                checked={selectedBrands.includes(brand)}
                onChange={handleBrandChange}
              />
              <label htmlFor={`brand_${index}`}>{brand}</label>{" "}
              {/* Ссылка на уникальный идентификатор */}
            </div>
          ))}
      </div>
      <br />
      <button className={styles.applyButton} onClick={handleFilter}>
        Применить фильтр
      </button>
    </div>
  );
};

FilterComponent.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  brands: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedCategory: PropTypes.string,
};

export default FilterComponent;
