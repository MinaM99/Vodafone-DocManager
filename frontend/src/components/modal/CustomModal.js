import React from 'react';
import classes from './CustomModal.module.css'; // Import the CSS module

const CustomModal = ({ show, onClose, message }) => {
  if (!show) {
    return null;
  }

  return (
    <div className={classes.modalOverlay}>
      <div className={classes.modalContent}>
        <p>{message}</p>
        <button onClick={onClose} className={classes.closeButton}>Close</button>
      </div>
    </div>
  );
};

export default CustomModal;