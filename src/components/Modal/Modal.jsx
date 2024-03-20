import PropTypes from "prop-types";
import styles from "./Modal.module.css";

const Modal = ({ onClose, children }) => {
  return (
    <div>
      {/* Modal content */}
      <div className={styles.modal}>
        <div
          className={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.modalContentContainer}>{children}</div>
          <span className={styles.closeButton} onClick={onClose}>
            ×
          </span>
        </div>
      </div>
      {/* Modal overlay */}
      <div className={styles.modalOverlay}></div>
    </div>
  );
};

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Modal;
