import React, {useEffect} from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, LinearScale, BarElement, CategoryScale } from 'chart.js';

// Register the necessary components and elements
Chart.register(ArcElement, Tooltip, Legend, LinearScale, BarElement, CategoryScale);

const PieChart = ({ data }) => {
  useEffect(() => {
    // Cleanup the previous chart instance to prevent conflicts
    return () => {
      // Destroy the previous chart instance if it exists
      const canvas = document.getElementById('pieChart');
      if (canvas && canvas.chart) {
        canvas.chart.destroy();
      }
    };
  }, [data]);

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

  // Setting options for the Pie chart to make it responsive and maintain the aspect ratio
  const options = {
    responsive: true,
    maintainAspectRatio: false,  // Allows resizing based on the container size
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default PieChart;
