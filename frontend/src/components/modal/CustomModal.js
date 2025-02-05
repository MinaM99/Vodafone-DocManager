import React from 'react';
import './CustomModal.css'; // Import the CSS file for modal styling

const CustomModal = ({ show, onClose, message }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default CustomModal;