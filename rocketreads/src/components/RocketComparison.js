import React, { useState, useEffect } from 'react';
import ChartBlock from './ChartBlock';
import axios from 'axios';

// component for displaying details of a specific rocket
// works in the same way as the LaunchComparison component 
const RocketComparison = ({ rocketId }) => {
  // state variables for storing and processing data
  const [rocketDetails, setRocketDetails] = useState(null);
  const [radarData, setRadarData] = useState({});
  const [barData, setBarData] = useState({});
  const [polarData, setPolarData] = useState({});

  useEffect(() => {
    if (rocketId) {
      axios.get(`https://api.spacexdata.com/v4/rockets/${rocketId}`)
        .then(response => {
          const details = response.data;
          setRocketDetails(details);

          // prepares radar chart data
          setRadarData({
            labels: ['Height (m)', 'Diameter (m)', 'Mass (kilo-tonne)'],
            datasets: [{
              label: details.name,
              data: [details.height.meters, details.diameter.meters, details.mass.kg / 10000],
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              borderColor: 'rgba(255, 99, 132, 1)',
            }],
          });

          
          setBarData({
            labels: ['First Stage Sea-level Thrust', 'First Stage Vacuum Thrust', 'Second Stage Thrust'],
            datasets: [{
              label: details.name + ' Thrust (kN)',
              data: [
                details.first_stage.thrust_sea_level.kN,
                details.first_stage.thrust_vacuum.kN,
                details.second_stage.thrust.kN,
              ],
              backgroundColor: [
                'rgba(241, 90, 36, 0.9)',
                'rgba(231, 100, 36, 0.7)',
                'rgba(221, 70, 50, 0.8)',
              ],
              borderColor: [
                'rgba(241, 90, 36, 0.9)',
                'rgba(231, 100, 36, 0.7)',
                'rgba(221, 70, 50, 0.8)',
              ],
              borderWidth: 1,
            }],
          });

          // prepares polar area chart data
          const payloadWeights = details.payload_weights.map(p => p.kg);
          const payloadNames = details.payload_weights.map(p => p.name);
          setPolarData({
            labels: payloadNames,
            datasets: [{
              label: details.name + ' Payload Weights (kg)',
              data: payloadWeights,
              backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
              ],
            }],
          });
        })
        .catch(error => console.error('Fetching rocket details failed:', error));
    }
  }, [rocketId]); //re-run if rocketID changes

  return (
    <div className="compareSheet">
      {/* conditionally renders if charts available */}
      {rocketDetails && (
        <>
          <img src={rocketDetails.flickr_images[0]} alt={rocketDetails.name} style={{ width: '100%', height: '38vh' }} />
          <h2>{rocketDetails.name}</h2>
          <p>{rocketDetails.description}</p>
          {radarData.labels && (
            <ChartBlock chartType="radar" chartData={radarData} title={"General Specifications"} />
          )}
          {barData.labels && (
            <ChartBlock chartType="bar" chartData={barData} title={"Thrust (kN)"}/>
          )}
          {polarData.labels && (
            <ChartBlock chartType="polarArea" chartData={polarData} title={"Payload Types & Weights"}/>
          )}
        </>
      )}
    </div>
  );
};

export default RocketComparison;
