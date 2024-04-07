import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import ChartBlock from './ChartBlock';
import StatBlock from './StatBlock';
import axios from 'axios';

const Dashboard = () => {
  const [launchData, setLaunchData] = useState({ successful: 0, total: 0 });
  const [rocketData, setRocketData] = useState({ active: 0, total: 0 });
  const [launchesOverTimeData, setLaunchesOverTimeData] = useState({
    labels: [],
    datasets: [{
      label: '',
      data: [],
      fill: false,
      borderColor: '',
      tension: 0
    }]
  });

  useEffect(() => {
    // Fetch launches data
    axios.get('https://api.spacexdata.com/v4/launches')
      .then(response => {
        const launches = response.data;
        const successfulLaunches = launches.filter(launch => launch.success).length;
        setLaunchData({ successful: successfulLaunches, total: launches.length });

        // Process for "Launches Over Time" Chart
        const launchesByYear = launches.reduce((acc, launch) => {
          const year = new Date(launch.date_utc).getFullYear();
          if (!acc[year]) {
            acc[year] = 0;
          }
          acc[year]++;
          return acc;
        }, {});

        const sortedYears = Object.keys(launchesByYear).sort((a, b) => a - b);
        const launchesCounts = sortedYears.map(year => launchesByYear[year]);

        setLaunchesOverTimeData({
          labels: sortedYears,
          datasets: [
            {
              label: 'Launches Over Time',
              data: launchesCounts,
              fill: false,
              borderColor: 'rgba(241, 90, 36, 0.9)',
              tension: 0.1
            }
          ]
        });
      })
      .catch(error => {
        console.error('Error fetching launch data:', error);
        
      });

    // Fetch rockets data
    axios.get('https://api.spacexdata.com/v4/rockets')
      .then(response => {
        const rockets = response.data;
        const activeRockets = rockets.filter(rocket => rocket.active).length;
        setRocketData({ active: activeRockets, total: rockets.length });
      })
      .catch(error => {
        console.error('Error fetching rocket data:', error);
        
      });

  }, []);

  return (
    <div>
      <div className="dashboard-header">
        <h1>Dashboard</h1>
      </div>
      <div className="dashboard-content">
        <StatBlock
          title="Successful Launches"
          currentValue={launchData.successful}
          maxValue={launchData.total}
        />
        <StatBlock
          title="Active Rockets"
          currentValue={rocketData.active}
          maxValue={rocketData.total}
        />
        <ChartBlock
          chartType="line"
          chartData={launchesOverTimeData}
          chartOptions={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Launches Over Time',
              },
            },
          }}
          title="Launches Over Time"
        />
      </div>
    </div>
  );
};

export default Dashboard;
