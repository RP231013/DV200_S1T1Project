import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import ChartBlock from './ChartBlock';
import StatBlock from './StatBlock';
import axios from 'axios';


// The dashboard page simply renders different ChartBlock components based off of data from API
const Dashboard = () => {
  // I use state variables to store data of launches for later use
  const [launchData, setLaunchData] = useState({ successful: 0, total: 0 });
  const [rocketData, setRocketData] = useState({ active: 0, total: 0 });

  // launches over time line graph (state for storing data)
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

  // stacked bar graph (state for storing data)
  const [launchPadNames, setLaunchPadNames] = useState({});
  const [successFailData, setSuccessFailData] = useState({
    labels: [],
    datasets: [
      { label: 'Success', data: [], backgroundColor: 'rgba(75, 192, 192, 0.5)' },
      { label: 'Fail', data: [], backgroundColor: 'rgba(255, 99, 132, 0.5)' }
    ]
  });

  // horizontal bar graph for types of payloads
  const [payloadTypesData, setPayloadTypesData] = useState({
    labels: [],
    datasets: [{
      label: 'Types of Payloads',
      data: [],
      backgroundColor: [],
    }]
  });
  
  // I use the useEffect hook that triggers data fetching when the component mounts
  useEffect(() => {

    // I use promise all to fetch all the data at the same time
    Promise.all([
      axios.get('https://api.spacexdata.com/v4/launches'),
      axios.get('https://api.spacexdata.com/v4/launchpads')
    ]).then(([launchesResponse, launchPadsResponse]) => {
        const launches = launchesResponse.data;
        // calculate successful launches (by use of filter - launch.success)
        const successfulLaunches = launches.filter(launch => launch.success).length;
        // update launch datat state
        setLaunchData({ successful: successfulLaunches, total: launches.length });

        const launchPads = launchPadsResponse.data;

        // here I combine the launches by year for launches over time chart by using reduce and accumulator
        // why? Data given by API is in date_utc format, I want it to be e.g. 2020: 2
        const launchesByYear = launches.reduce((acc, launch) => {
          const year = new Date(launch.date_utc).getFullYear();
          if (!acc[year]) {
            acc[year] = 0;
          }
          acc[year]++;
          return acc;
        }, {});
        
        // here data is sorted and prepared for chart
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

        // creates a map of launch pad IDs to names
        // since pad names are gotten through separate API call
        const launchPadMap = launchPads.reduce((acc, pad) => {
          acc[pad.id] = pad.name;
          return acc;
        }, {});
        setLaunchPadNames(launchPadMap);

        // counts success and failures per launch pad to be used in chart
        const successFailCounts = launches.reduce((acc, launch) => {
          const padId = launch.launchpad;
          if (!acc[padId]) {
            // accumulator and reduce changes current json format into e.g. pad1: { success: 1, fail: 1 } which can then be used in chart
            acc[padId] = { success: 0, fail: 0 };
          }
          launch.success ? acc[padId].success++ : acc[padId].fail++;
          return acc;
        }, {});

        // change the counts into format for the chart
        // "keys" extracts launchpad IDs
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
        console.log('err getting launch data', error);
        
      });

    // get/fetch rockets data
    axios.get('https://api.spacexdata.com/v4/rockets')
      .then(response => {
        const rockets = response.data;
        const activeRockets = rockets.filter(rocket => rocket.active).length;
        setRocketData({ active: activeRockets, total: rockets.length });
      })
      .catch(error => {
        console.error('err getting rocket data', error);
        
      });
    
    // get payload data
    axios.get('https://api.spacexdata.com/v4/payloads')
      .then(response => {
        const payloads = response.data;

        // combines payloads by types
        const payloadTypes = payloads.reduce((acc, payload) => {
          const type = payload.type || 'Unknown'; // "|| Unknown" = error handling of it does not have a type
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {});

        // get data ready for the horizontal bar chart
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
      console.error('Could not get payload data:', error);
    });

  }, []);

  return (
    <div>
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to the SpaceX Launch Dashboard, your premier destination for exploring and visualizing the incredible journey of SpaceX launches, payloads, and spacecraft. </p>
      </div>
      {/* here data is passed as props to relevant child component - chart or stat blocks, are then displayed/rendered*/}
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
            indexAxis: 'y', 
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
