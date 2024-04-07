import React from 'react';
import './ChartBlock.css';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
function ChartBlock() {
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Number of Items Sold',
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        backgroundColor: 'rgba(241, 90, 36, 0.9)',
        borderColor: 'rgba(241, 90, 36, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
        text: 'Chart.js Line Chart',
      },
    },
  };

  return (
    <div className='chartBlockBody'>
      <h2>Chart Title</h2>
      <Line data={data} options={options}/>
    </div>
  );
}

export default ChartBlock;