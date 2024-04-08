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

// I structured my code in the way that I can use the chartBlock for any chart in any other component
// This registerables ensures that I import any and all possible registerables for the different types of charts
ChartJS.register(...registerables);

// here I map the chart-type-string to the corresponding React component that renders it so that I can dynamically choose a different chart
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

// my chart block component accepts the chartType, data, options, title and id as props
// again this allows me to render any type of chart with just this one ChartBlock component
function ChartBlock({ chartType, chartData, chartOptions, title, id }) {
  
  // here, chartComponent is set to whatever chart type has been passed
  const ChartComponent = CHART_COMPONENTS[chartType] || Line; // "||" = defaults to line if no type given - error handling

  return (
    <div className='chartBlockBody' id={id}>
      <h3 className='chartBlockHeader'>{title}</h3>
      {/* the appropriate chart type is then returned */}
      <ChartComponent data={chartData} options={chartOptions} />
    </div>
  );
}

export default ChartBlock;
