import React from 'react';
import './ChartBlock.css';
import {
  Bar,
  Line,
  Pie,
  Doughnut,
  Radar,
  PolarArea,
  Bubble,
  Scatter,
} from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';


ChartJS.register(...registerables);


const CHART_COMPONENTS = {
  bar: Bar,
  line: Line,
  pie: Pie,
  doughnut: Doughnut,
  radar: Radar,
  polarArea: PolarArea,
  bubble: Bubble,
  scatter: Scatter,
};

function ChartBlock({ chartType, chartData, chartOptions, title }) {
  
  const ChartComponent = CHART_COMPONENTS[chartType] || Line;

  return (
    <div className='chartBlockBody'>
      <h2 className='chartBlockHeader'>{title}</h2>
      <ChartComponent data={chartData} options={chartOptions} />
    </div>
  );
}

export default ChartBlock;
