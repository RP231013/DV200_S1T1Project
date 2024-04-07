import React from 'react';
import './Dashboard.css';
import ChartBlock from './ChartBlock';
import StatBlock from './StatBlock';

const Dashboard = () => {

  // Fake data for testing
  const lineChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Fake Launches Over Time',
        data: [12, 19, 3, 5, 2, 3],
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Fake Launches Over Time',
      },
    },
  };
  
  return (
    <div>
      <div className="dashboard-header">
        <h1>Dashboard</h1>
      </div>
      <div className="dashboard-content">

      <ChartBlock
        chartType="line"
        chartData={lineChartData}
        chartOptions={lineChartOptions}
        title="Test Line Graph"
      />


      <StatBlock
        title="No. Rockets Active"
        currentValue={"5"}
        maxValue={"10"}
      />
      <StatBlock
        title="No. Launches"
        currentValue={"16"}
        maxValue={"20"}
      />

        
      </div>
    </div>
  );
};

export default Dashboard;