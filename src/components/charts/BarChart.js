import React, { useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, LinearScale, BarElement, CategoryScale } from 'chart.js';

// Register the necessary components and elements
Chart.register(ArcElement, Tooltip, Legend, LinearScale, BarElement, CategoryScale);

const BarChart = ({ data }) => {
  useEffect(() => {
    // Cleanup the previous chart instance to prevent conflicts
    return () => {
      // Destroy the previous chart instance if it exists
      const canvas = document.getElementById('barChart');
      if (canvas && canvas.chart) {
        canvas.chart.destroy();
      }
    };
  }, [data]);

  // Extract the dateOfDay as labels and map success/failure data accordingly
  const labels = data.map(item => item.dateOfDay);  // Use dateOfDay as x-axis labels
  const successData = data.map(item => item.uploaded_documents);
  const failedData = data.map(item => item.failed_documents);

  const chartData = {
    labels,  // Use the dateOfDay values as the labels for the x-axis
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

  // Setting options for the Bar chart to make it responsive and maintain the aspect ratio
  const options = {
    responsive: true,
    maintainAspectRatio: false,  // Allows resizing based on the container size
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        // Set the x-axis to be categorical (dates as labels)
        type: 'category',
        title: {
          display: true,
          text: 'Date',  // Label for the x-axis
        },
        ticks: {
          // Optionally, you can rotate or format the date labels if they overlap
          autoSkip: true,  // Skip labels if they overlap
          maxRotation: 45, // Rotate labels by 45 degrees for better visibility
          minRotation: 45, // Keep the rotation consistent
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Documents',  // Label for the y-axis
        },
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart;
