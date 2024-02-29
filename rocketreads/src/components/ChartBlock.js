


import React, { useRef } from 'react';

import './ChartBlock.css';
import { Line } from 'react-chartjs-2';

function ChartBlock() {
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Number of Items Sold',
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
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
        display: true,
        text: 'Chart.js Line Chart',
      },
    },
  };

  return (
    <div className='chartBlockBody'>
      <h2>Chart Title</h2>
      <Line data={data} options={options} />
    </div>
  );
}

export default ChartBlock;