import React, { useState } from "react";
import "./DateFilter.css";

const DateFilter = ({ onDateRangeChange }) => {
  const today = new Date();
  
  // Helper function to format dates as DD-MM-YYYY
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formattedToday = formatDate(today);
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const formattedFirstDay = formatDate(firstDayOfMonth);

  // Local state for date range
  const [startDate, setStartDate] = useState(formattedFirstDay);
  const [endDate, setEndDate] = useState(formattedToday);

  const handleStartDateChange = (e) => {
    const dateParts = e.target.value.split("-"); // Format: YYYY-MM-DD
    const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // Convert to DD-MM-YYYY
    setStartDate(formattedDate);
  };

  const handleEndDateChange = (e) => {
    const dateParts = e.target.value.split("-"); // Format: YYYY-MM-DD
    const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // Convert to DD-MM-YYYY
    setEndDate(formattedDate);
  };

  const handleFilterClick = () => {
    const startDateParts = startDate.split("-").reverse().join("-");
    const endDateParts = endDate.split("-").reverse().join("-");

    if (new Date(startDateParts) > new Date(endDateParts)) {
      alert("Start date cannot exceed end date.");
      return;
    }
    // Trigger the parent function to fetch data
    onDateRangeChange(startDate, endDate);
  };

  return (
    <div className="date-filter">
      <div className="input-group">
        <label htmlFor="start-date">Start Date:</label>
        <input
          id="start-date"
          type="date"
          value={startDate.split("-").reverse().join("-")} // Convert DD-MM-YYYY to YYYY-MM-DD for input
          onChange={handleStartDateChange}
          max={formattedToday.split("-").reverse().join("-")} // Convert DD-MM-YYYY to YYYY-MM-DD for input
        />
        <label htmlFor="end-date">End Date:</label>
        <input
          id="end-date"
          type="date"
          value={endDate.split("-").reverse().join("-")} // Convert DD-MM-YYYY to YYYY-MM-DD for input
          onChange={handleEndDateChange}
          max={formattedToday.split("-").reverse().join("-")} // Convert DD-MM-YYYY to YYYY-MM-DD for input
        />
      </div>
      <button onClick={handleFilterClick}>Filter</button>
    </div>
  );
};

export default DateFilter;
