import React, { useState, useEffect } from 'react';
import './DateFilter.css';

const DateFilter = ({ data, onFilterData }) => {
  const today = new Date();
  const formattedToday = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const formattedFirstDay = firstDayOfMonth.toISOString().split('T')[0]; // Format as YYYY-MM-DD

  // Local state for date range
  const [startDate, setStartDate] = useState(formattedFirstDay);
  const [endDate, setEndDate] = useState(formattedToday);

  useEffect(() => {
    // Perform default filtering for the initial date range
    filterData(formattedFirstDay, formattedToday);
  }, []); // Only runs on component mount

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const filterData = (start, end) => {
    const selectedStartDate = new Date(start);
    const selectedEndDate = new Date(end);

    const filtered = Object.keys(data).reduce((acc, key) => {
      const date = new Date(key.split('-').reverse().join('-'));
      if (date >= selectedStartDate && date <= selectedEndDate) {
        acc[key] = data[key];
      }
      return acc;
    }, {});

    onFilterData(filtered); // Pass filtered data to parent
  };

  const handleFilterClick = () => {
    if (new Date(startDate) > new Date(endDate)) {
      alert("Start date cannot exceed end date.");
      return;
    }
    filterData(startDate, endDate);
  };

  return (
    <div className="date-filter">
      <div className="input-group">
        <label htmlFor="start-date">Start Date:</label>
        <input
          id="start-date"
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          max={formattedToday}
        />
        <label htmlFor="end-date">End Date:</label>
        <input
          id="end-date"
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
          max={formattedToday}
        />
      </div>
      <button onClick={handleFilterClick}>Filter</button>
    </div>
  );
};

export default DateFilter;
