import React from 'react';
import DateFilter from './../filters/DateFilter';
import PieChart from './../charts/PieChart';
import BarChart from './../charts/BarChart';

const Statistics = ({ username, data, filteredData, noDataFound, onFilterData }) => (
  <>
    <h1>Document Statistics</h1>
    <DateFilter data={data} onFilterData={onFilterData} />
    {noDataFound ? (
      <div className="no-data-indicator">
        <p>No data found for the selected date range.</p>
      </div>
    ) : (
      <div className="charts">
        {Object.keys(filteredData).length > 0 && (
          <>
            <PieChart data={filteredData} />
            <BarChart data={filteredData} />
          </>
        )}
      </div>
    )}
  </>
);

export default Statistics;
