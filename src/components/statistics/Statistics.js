import React, { useState, useEffect } from "react";
import "./Statistics.css";
import DateFilter from "./../filters/DateFilter";
import PieChart from "./../charts/PieChart";
import BarChart from "./../charts/BarChart";
import config from "../../data/config.json";

const Statistics = ({ username, userGroup }) => {
  const [filteredData, setFilteredData] = useState([]);  // State for storing filtered data
  const [noDataFound, setNoDataFound] = useState(false);  // State to track if no data is found

    // Function to format date as DD-MM-YYYY
    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, "0");  // Ensure 2-digit day
      const month = String(date.getMonth() + 1).padStart(2, "0");  // Ensure 2-digit month
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;  // Format as DD-MM-YYYY
    };
  
    // Function to calculate the first and last day of the current month
    const getCurrentMonthRange = () => {
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);  // First day of the month
      return {
        startDate: formatDate(firstDay),  // Format start date as DD-MM-YYYY
        endDate: formatDate(today),    // Format end date as DD-MM-YYYY
      };
    };

  // Function to fetch data based on date range
  const fetchData = async (startDate, endDate) => {
    const apiURL = "http://10.0.40.26:8080/vodafone/status";  // API URL for fetching the data
    const requestBody = { startDate, endDate };  // Date range for filtering

    try {
      const response = await fetch(apiURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",  // Set content type for request
        },
        body: JSON.stringify(requestBody),  // Send the date range in the request body
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const apiData = await response.json();
      setFilteredData(apiData.Documents_Upload_Status);  // Store filtered data
      setNoDataFound(apiData.Documents_Upload_Status.length === 0);  // Set noDataFound if no data exists
    } catch (error) {
      console.error("Error fetching API data:", error);
      setNoDataFound(true);  // Handle error if fetching data fails
    }
  };

  // Handle date range change (triggered by the DateFilter component)
  const handleDateRangeChange = (startDate, endDate) => {
    fetchData(startDate, endDate);  // Call fetchData when date range changes
  };

  // Fetch the data for the current month when the component is first rendered
  useEffect(() => {
    const { startDate, endDate } = getCurrentMonthRange();  // Get current month's date range
    fetchData(startDate, endDate);  // Fetch data for the current month
  }, []);  // Empty dependency array to run this only once on mount

  return (
    <div className="statistics-container">
      <h1>Document Statistics</h1>
      <p>Welcome, {username}! View statistics for uploaded and failed documents below.</p>
      <DateFilter onDateRangeChange={handleDateRangeChange} />  {/* Date range filter component */}
      {noDataFound ? (
        <div className="no-data-indicator">
          <p>No data found for the selected date range.</p>
        </div>
      ) : (
        <div className="charts">
          {filteredData.length > 0 ? (
            <>
            <div className="chart chart-left">
                <PieChart data={filteredData} />
            </div>
            <div className="chart chart-right">
                <BarChart data={filteredData} />
            </div>
            
            </>
     
          ) : (
            <div className="no-data-indicator">
              <p>No filtered data available.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Statistics;
