import React, { useRef } from 'react';
import './Dashboard.css';
import ChartBlock from './ChartBlock';
import StatBlock from './StatBlock';

const Dashboard = () => {
  // Your dashboard content
  return (
    <div>
      <div className="dashboard-header">
        <h1>Dashboard</h1>
      </div>
      <div className="dashboard-content">
        <ChartBlock/>
        <ChartBlock/>
        <StatBlock/>
        <StatBlock/>
        <ChartBlock/>
        
      </div>
    </div>
  );
};

export default Dashboard;