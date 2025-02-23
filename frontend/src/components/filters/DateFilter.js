import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import the default styles
import { format } from 'date-fns';
import classes from './DateFilter.module.css'; // Import the CSS module
import CustomModal from '../modal/CustomModal'; // Import the CustomModal component

const DateFilter = ({ onDateRangeChange }) => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // Local state for date range
  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(today);
  const [error, setError] = useState(false); // State to track error
  const [modalMessage, setModalMessage] = useState(""); // State for modal message
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  const handleFilterClick = () => {
    const dateRegex = /^(0?[1-9]|[12][0-9]|3[01])-(0?[1-9]|1[0-2])-\d{4}$/; // Allow only valid date format DD-MM-YYYY

    const formattedStartDate = format(startDate, 'dd-MM-yyyy');
    const formattedEndDate = format(endDate, 'dd-MM-yyyy');

    if (!dateRegex.test(formattedStartDate)) {
      setModalMessage("Please enter a valid start date in the format DD-MM-YYYY.");
      setError(true); // Set error state
      setShowModal(true); // Show the modal
      return;
    }

    if (!dateRegex.test(formattedEndDate)) {
      setModalMessage("Please enter a valid end date in the format DD-MM-YYYY.");
      setError(true); // Set error state
      setShowModal(true); // Show the modal
      return;
    }

    if (startDate > endDate) {
      setModalMessage("Start date cannot exceed end date.");
      setError(true); // Set error state
      setShowModal(true); // Show the modal
      return;
    }

    // Trigger the parent function to fetch data
    onDateRangeChange(formattedStartDate, formattedEndDate);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleKeyDown = (e) => {
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-'];
    if (!allowedKeys.includes(e.key) && e.key !== 'Backspace' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Tab') {
      e.preventDefault();
    }
  };

  return (
    <div className={classes.dateFilter}>
      <div className={classes.dateInputs}>
        <div className={classes.inputGroup}>
          <label htmlFor="start-date">Start Date:</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="dd-MM-yyyy"
            maxDate={today}
            onKeyDown={handleKeyDown}
            className={error ? classes.inputError : ''}
          />
        </div>
        <div className={classes.inputGroup}>
          <label htmlFor="end-date">End Date:</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="dd-MM-yyyy"
            minDate={startDate}
            maxDate={today}
            onKeyDown={handleKeyDown}
            className={error ? classes.inputError : ''}
          />
        </div>
      </div>
      <button className={classes.filterButton} onClick={handleFilterClick}>Filter</button>
      <CustomModal show={showModal} onClose={handleCloseModal} message={modalMessage} />
    </div>
  );
};

export default DateFilter;