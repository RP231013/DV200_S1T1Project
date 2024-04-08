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

function ChartBlock({ chartType, chartData, chartOptions, title, id }) {
  
  const ChartComponent = CHART_COMPONENTS[chartType] || Line;

  return (
    <div className='chartBlockBody' id={id}>
      <h3 className='chartBlockHeader'>{title}</h3>
      <ChartComponent data={chartData} options={chartOptions} />
    </div>
  );
}

export default ChartBlock;
