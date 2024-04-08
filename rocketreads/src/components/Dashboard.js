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

  // stacked bar graph
  const [launchPadNames, setLaunchPadNames] = useState({});
  const [successFailData, setSuccessFailData] = useState({
    labels: [],
    datasets: [
      { label: 'Success', data: [], backgroundColor: 'rgba(75, 192, 192, 0.5)' },
      { label: 'Fail', data: [], backgroundColor: 'rgba(255, 99, 132, 0.5)' }
    ]
  });

  const [payloadTypesData, setPayloadTypesData] = useState({
    labels: [],
    datasets: [{
      label: 'Types of Payloads',
      data: [],
      backgroundColor: [],
    }]
  });
  
  
  useEffect(() => {

    Promise.all([
      axios.get('https://api.spacexdata.com/v4/launches'),
      axios.get('https://api.spacexdata.com/v4/launchpads')
    ]).then(([launchesResponse, launchPadsResponse]) => {
        const launches = launchesResponse.data;
        const successfulLaunches = launches.filter(launch => launch.success).length;
        setLaunchData({ successful: successfulLaunches, total: launches.length });

        const launchPads = launchPadsResponse.data;

        
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

        // Create a map of launch pad IDs to names
        const launchPadMap = launchPads.reduce((acc, pad) => {
          acc[pad.id] = pad.name;
          return acc;
        }, {});

        setLaunchPadNames(launchPadMap);

        // Process launches to count successes and failures per launch site
        const successFailCounts = launches.reduce((acc, launch) => {
          const padId = launch.launchpad;
          if (!acc[padId]) {
            acc[padId] = { success: 0, fail: 0 };
          }
          launch.success ? acc[padId].success++ : acc[padId].fail++;
          return acc;
        }, {});

        // Convert the counts into a format suitable for the chart
        const labels = Object.keys(successFailCounts).map(id => launchPadMap[id]);
        const successData = Object.values(successFailCounts).map(counts => counts.success);
        const failData = Object.values(successFailCounts).map(counts => counts.fail);
        
        setSuccessFailData({
          labels,
          datasets: [
            { label: 'Success', data: successData, backgroundColor: 'rgba(241, 90, 36, 0.8)' },
            { label: 'Fail', data: failData, backgroundColor: 'rgba(179, 0, 0, 0.8)' }
          ]
        });




      }).catch(error => {
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

      axios.get('https://api.spacexdata.com/v4/payloads')
    .then(response => {
      const payloads = response.data;

      // Categorize payloads by type
      const payloadTypes = payloads.reduce((acc, payload) => {
        const type = payload.type || 'Unknown'; // Use 'Unknown' for payloads without a type
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});

      // Prepare data for the horizontal bar chart
      const labels = Object.keys(payloadTypes);
      const data = Object.values(payloadTypes);

      setPayloadTypesData({
        labels,
        datasets: [{
          label: 'Types of Payloads',
          data,
          backgroundColor: 'rgba(230, 90, 36, 0.9)',
        }]
      });
    })
    .catch(error => {
      console.error('Error fetching payload data:', error);
      // Handle error state here if needed
    });

  }, []);

  return (
    <div>
      <div className="dashboard-header">
        
        <h1>Dashboard</h1>
        <p>Welcome to the SpaceX Launch Dashboard, your premier destination for exploring and visualizing the incredible journey of SpaceX launches, payloads, and spacecraft. </p>
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

        <ChartBlock
          chartType="bar"
          chartData={successFailData}
          chartOptions={{
            scales: {
              x: { stacked: true },
              y: { stacked: true }
            },
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: 'Success vs. Fail per Launch Site' },
            },
            responsive: true,
          }}
          title="Success vs. Fail per Launch Site"
        />

        <ChartBlock
          chartType="bar"
          chartData={payloadTypesData}
          chartOptions={{
            indexAxis: 'y', // Specify 'y' for a horizontal bar chart
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Types of Payloads',
              },
            },
            responsive: true,
          }}
          title="Types of Payloads"
        />

      </div>
    </div>
  );
};

export default Dashboard;
