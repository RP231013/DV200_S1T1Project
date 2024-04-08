import React, { useState, useEffect } from 'react';
import ChartBlock from './ChartBlock';
import axios from 'axios';

// again because component based, using a "comparesheet" that can be reused because it can be dynamically populated

const LaunchComparison = ({ launchpadId }) => {
  // again state variables to store/manage data
  const [launchpadDetails, setLaunchpadDetails] = useState(null);
  const [launches, setLaunches] = useState([]);
  const [successFailureChartData, setSuccessFailureChartData] = useState({});
  const [rocketDistributionChartData, setRocketDistributionChartData] = useState({});

  useEffect(() => {
    if (launchpadId) {
      // fetches by llaunchpad ID
      axios.get(`https://api.spacexdata.com/v4/launchpads/${launchpadId}`)
        .then(response => {
          // stores data
          setLaunchpadDetails(response.data);
          
          // fetches all launches to filter by launchpad later
          axios.get('https://api.spacexdata.com/v4/launches')
            .then(response => {
              const padLaunches = response.data
              .filter(launch => launch.launchpad === launchpadId);
              // filters to get only data from selected launch pad
              setLaunches(padLaunches);
              
              // calculates successful vs unsuccessful launches bar chart data
              const successCount = padLaunches.filter(launch => launch.success).length;
              const failureCount = padLaunches.length - successCount;
              // prepares data for chart
              setSuccessFailureChartData({
                labels: ['Successful Launches', 'Unsuccessful Launches'],
                datasets: [{
                  label: 'Launch Outcomes',
                  data: [successCount, failureCount],
                  backgroundColor: ['rgba(241, 90, 36, 0.6)', 'rgba(255, 90, 36, 0.2)'],
                  borderColor: ['rgba(241, 90, 36, 0.6)', 'rgba(255, 90, 36, 0.2)'],
                  borderWidth: 0
                }]
              });

              // different rockets per pad data (again uses accumulator and reduce to refactor data)
              const rocketCounts = padLaunches.reduce((acc, launch) => {
                acc[launch.rocket] = (acc[launch.rocket] || 0) + 1;
                return acc;
              }, {});

              // gets rocket data
              axios.get('https://api.spacexdata.com/v4/rockets')
                .then(response => {
                  const rockets = response.data;
                  // mapping rocket IDs to names for chart
                  const rocketLabels = Object.keys(rocketCounts).map(rocketId => {
                    const rocket = rockets.find(r => r.id === rocketId);
                    return rocket ? rocket.name : 'Unknown Rocket';
                  });
                  const rocketValues = Object.values(rocketCounts);

                  setRocketDistributionChartData({
                    labels: rocketLabels,
                    datasets: [{
                      label: 'Rockets Launched',
                      data: rocketValues,
                      backgroundColor: ['rgba(241, 90, 36, 0.8)', 'rgba(211, 60, 90, 0.6)'],
                      hoverOffset: 4
                    }]
                  });
                });
            });
        })
        .catch(error => console.error('Fetching launchpad details failed:', error));
    }
  }, [launchpadId]); //re-fetch when launchPadID changes

  return (
    // returns compareSheet 
    <div className="compareSheet">
      {/* conditionally render charts if available */}
      {launchpadDetails && (
        <>
          <img src={launchpadDetails.images.large[0]} alt={launchpadDetails.name} style={{ width: '100%', height: '37vh' }} />
          <h2>{launchpadDetails.name}</h2>
          <p style={{ height: 'fit-content' }}>{launchpadDetails.details}</p>
          <p><b>Location: {launchpadDetails.region} </b></p>
          {successFailureChartData.labels && (
            <ChartBlock chartType="bar" chartData={successFailureChartData} title={"Launch Outcomes"} />
          )}
          {rocketDistributionChartData.labels && (
            <ChartBlock chartType="pie" chartData={rocketDistributionChartData} title={"Rocket Distributions"}/>
          )}
        </>
      )}
    </div>
  );
};

export default LaunchComparison;
