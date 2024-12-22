import React from 'react';
import { Bar } from 'react-chartjs-2';

const BarChart = ({ data }) => {
  const labels = Object.keys(data);
  const successData = labels.map((key) => parseInt(data[key].uploaded_documents));
  const failedData = labels.map((key) => parseInt(data[key].failed_documents));

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Success',
        data: successData,
        backgroundColor: '#4caf50',
      },
      {
        label: 'Failed',
        data: failedData,
        backgroundColor: '#f44336',
      },
    ],
  };

  return <Bar data={chartData} />;
};

export default BarChart;
