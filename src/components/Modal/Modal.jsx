import PropTypes from "prop-types";
import styles from "./Modal.module.css";

const Modal = ({ onClose, children }) => {
  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modalСontent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalContentContainer}>{children}</div>
        <span className={styles.closeButton} onClick={onClose}>
          ×
        </span>
      </div>
    </div>
  );
};

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Modal;
