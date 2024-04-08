import React, { useState, useEffect } from 'react';
import Dropdown from './Dropdown'; 
import ChartBlock from './ChartBlock'; 
import axios from 'axios';
import './Timelines.css';


const Timelines = () => {


  const [selectedTimeline, setSelectedTimeline] = useState('null');
  const [chartData, setChartData] = useState({});

  // Function to fetch and prepare data for the chart based on the selected timeline
  const fetchDataForTimeline = async (timeline) => {
    switch (timeline) {
      case 'launchesOverTime':
        // Fetch data and prepare chartData for launches over time
        try {
          const response = await axios.get('https://api.spacexdata.com/v4/launches');
          const launches = response.data;
      
          // Aggregate launches by year
          const launchesByYear = launches.reduce((acc, launch) => {
            const year = new Date(launch.date_utc).getFullYear();
            acc[year] = (acc[year] || 0) + 1;
            return acc;
          }, {});
      
          // Prepare labels and data for the chart
          const years = Object.keys(launchesByYear).sort((a, b) => a - b);
          const launchCounts = years.map(year => launchesByYear[year]);
      
          // Update chartData state
          setChartData({
            labels: years,
            datasets: [{
              label: 'Launches Over Time',
              data: launchCounts,
              fill: false,
              borderColor: 'rgba(241, 90, 36, 0.9)',
              tension: 0.1
            }]
          });
        } catch (error) {
          console.error('Error fetching launches data:', error);
          setChartData({});
        }
        break;
      case 'successVsFailedLaunches':
        try {
          const response = await axios.get('https://api.spacexdata.com/v4/launches');
          const launches = response.data;
      
          // Aggregate successful and unsuccessful launches by year
          const launchesByYear = launches.reduce((acc, launch) => {
            const year = new Date(launch.date_utc).getFullYear();
            if (!acc[year]) {
              acc[year] = { successful: 0, unsuccessful: 0 };
            }
            if (launch.success) {
              acc[year].successful += 1;
            } else {
              // Considering null (undetermined outcome) as unsuccessful for simplicity
              acc[year].unsuccessful += 1;
            }
            return acc;
          }, {});
      
          // Prepare labels and data for the chart
          const years = Object.keys(launchesByYear).sort((a, b) => a - b);
          const successCounts = years.map(year => launchesByYear[year].successful);
          const failureCounts = years.map(year => launchesByYear[year].unsuccessful);
      
          // Update chartData state for two lines: Successful and Unsuccessful Launches
          setChartData({
            labels: years,
            datasets: [
              {
                label: 'Successful Launches',
                data: successCounts,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
              },
              {
                label: 'Unsuccessful Launches',
                data: failureCounts,
                fill: false,
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1
              }
            ]
          });
        } catch (error) {
          console.error('Error fetching launches data:', error);
          setChartData({});
        }
        break;
      case 'payloadTypesOverTime':
        try {
          // First, fetch all payloads to categorize them by type.
          const payloadsResponse = await axios.get('https://api.spacexdata.com/v4/payloads');
          const payloads = payloadsResponse.data;
          
          // Categorize payloads by ID for easy lookup
          const payloadsById = payloads.reduce((acc, payload) => {
            acc[payload.id] = payload;
            return acc;
          }, {});
      
          // Then, fetch all launches
          const launchesResponse = await axios.get('https://api.spacexdata.com/v4/launches');
          const launches = launchesResponse.data;
      
          // Aggregate launches by payload type and year
          const launchesByPayloadTypeAndYear = launches.reduce((acc, launch) => {
            launch.payloads.forEach(payloadId => {
              const payload = payloadsById[payloadId];
              const year = new Date(launch.date_utc).getFullYear();
              const type = payload ? payload.type : 'Unknown';
      
              if (!acc[type]) acc[type] = {};
              if (!acc[type][year]) acc[type][year] = 0;
              acc[type][year]++;
            });
            return acc;
          }, {});
      
          // Prepare labels and data for the chart
          const years = [...new Set(launches.map(launch => new Date(launch.date_utc).getFullYear()))].sort((a, b) => a - b);
          
          // This part creates a dataset for each payload type
          const datasets = Object.keys(launchesByPayloadTypeAndYear).map(type => {
            const data = years.map(year => launchesByPayloadTypeAndYear[type][year] || 0);
            return {
              label: type,
              data: data,
              fill: false,
              borderColor: `hsl(${Math.random() * 360}, 100%, 70%)`, // Random color for each type
              tension: 0.1
            };
          });
      
          setChartData({
            labels: years,
            datasets: datasets
          });
        } catch (error) {
          console.error('Error fetching payload types data:', error);
          setChartData({});
        }
        break;
      case 'payloadMassOverTime':
        try {
          // Fetch all payloads to get their mass
          const payloadsResponse = await axios.get('https://api.spacexdata.com/v4/payloads');
          const payloads = payloadsResponse.data;
          
          // Create a mapping of payload ID to mass for quick lookup
          const payloadMassById = payloads.reduce((acc, payload) => {
            acc[payload.id] = payload.mass_kg || 0; // Use 0 as a fallback if mass_kg is undefined
            return acc;
          }, {});
      
          // Then, fetch all launches
          const launchesResponse = await axios.get('https://api.spacexdata.com/v4/launches');
          const launches = launchesResponse.data;
      
          // Aggregate total payload mass by year
          const totalMassByYear = launches.reduce((acc, launch) => {
            const year = new Date(launch.date_utc).getFullYear();
            const launchPayloadMass = launch.payloads.reduce((sum, payloadId) => sum + payloadMassById[payloadId], 0);
            
            acc[year] = (acc[year] || 0) + launchPayloadMass;
            return acc;
          }, {});
      
          // Prepare labels and data for the chart
          const years = Object.keys(totalMassByYear).sort((a, b) => a - b);
          const totalMasses = years.map(year => totalMassByYear[year]);
      
          setChartData({
            labels: years,
            datasets: [{
              label: 'Total Payload Mass Over Time (kg)',
              data: totalMasses,
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
              fill: false,
              tension: 0.1
            }]
          });
        } catch (error) {
          console.error('Error fetching payload mass data:', error);
          setChartData({});
        }
        break;
      case 'launchesPerPad':
        try {
          // Fetch all launches
          const launchesResponse = await axios.get('https://api.spacexdata.com/v4/launches');
          const launches = launchesResponse.data;
      
          // Fetch launchpad information to map IDs to names
          const launchpadsResponse = await axios.get('https://api.spacexdata.com/v4/launchpads');
          const launchpads = launchpadsResponse.data;
          const launchpadMap = launchpads.reduce((acc, pad) => {
            acc[pad.id] = pad.name;
            return acc;
          }, {});
      
          // Aggregate launches by pad and year
          const launchesByPadAndYear = launches.reduce((acc, launch) => {
            const year = new Date(launch.date_utc).getFullYear();
            const padName = launchpadMap[launch.launchpad] || 'Unknown';
      
            if (!acc[padName]) acc[padName] = {};
            if (!acc[padName][year]) acc[padName][year] = 0;
            acc[padName][year] += 1;
      
            return acc;
          }, {});
      
          // Prepare labels (years) and datasets for each launchpad
          const years = [...new Set(launches.map(launch => new Date(launch.date_utc).getFullYear()))].sort((a, b) => a - b);
          const datasets = Object.keys(launchesByPadAndYear).map(padName => {
            const data = years.map(year => launchesByPadAndYear[padName][year] || 0);
            return {
              label: padName,
              data: data,
              fill: false,
              borderColor: `hsl(${Math.random() * 360}, 100%, 70%)`, // Random color for each pad
              tension: 0.1
            };
          });
      
          setChartData({
            labels: years,
            datasets: datasets
          });
        } catch (error) {
          console.error('Error fetching launches per pad data:', error);
          setChartData({});
        }
        break;
      default:
        setChartData({});
    }
  };

  // Effect to react to changes in selectedTimeline
  useEffect(() => {
    if (selectedTimeline !== 'null') {
      fetchDataForTimeline(selectedTimeline);
    }
  }, [selectedTimeline]);
  
  return <div>
    <div className="timelines-header">
        
        <h1>Timelines</h1>
        <p>Welcome to the Timelines Page. Simply select what you'd like to have displayed using the dropdown below. </p>
      </div>
      <div className="timelines-content">

        <Dropdown 
          options={[
            { value: 'null', label: 'Select Timeline' },
            { value: 'launchesOverTime', label: 'Launches Over Time' },
            { value: 'successVsFailedLaunches', label: 'Success vs. Unsuccessful Launches Over Time' },
            { value: 'payloadTypesOverTime', label: 'Payload Types Over Time' },
            { value: 'payloadMassOverTime', label: 'Total Payload Mass Over Time' },
            { value: 'launchesPerPad', label: 'Number of Rockets/Launches per Pad Over Time' }
            
          ]}
          selectedValue={selectedTimeline}
          handleChange={(e) => setSelectedTimeline(e.target.value)} // Correctly matching the Dropdown prop
          id="longerDropdown"
        />

        {selectedTimeline !== 'null' && chartData.labels && (
          <ChartBlock id='biggerChart' chartType="line" chartData={chartData} />
        )}

      </div>
    </div>;

};

export default Timelines;