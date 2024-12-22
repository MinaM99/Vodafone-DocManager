import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, LinearScale, BarElement,CategoryScale } from 'chart.js';

// Register the necessary components and elements
Chart.register(ArcElement, Tooltip, Legend, LinearScale, BarElement,CategoryScale);

const PieChart = ({ data }) => {
  const success = Object.values(data).reduce((totalUploaded, day) => totalUploaded + parseInt(day.uploaded_documents), 0);
  const failed = Object.values(data).reduce((totalFailed, day) => totalFailed + parseInt(day.failed_documents), 0);
  
  const chartData = {
    labels: ['Success', 'Failed'],
    datasets: [
      {
        label: 'Documents',
        data: [success, failed],
        backgroundColor: ['#4caf50', '#f44336'],
      },
    ],
  };

  return <Pie data={chartData} />;
};

export default PieChart;