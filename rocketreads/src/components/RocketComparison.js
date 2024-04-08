import React, { useState, useEffect } from 'react';
import ChartBlock from './ChartBlock';
import axios from 'axios';

const RocketComparison = ({ rocketId }) => {
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

          // Prepare radar chart data
          setRadarData({
            labels: ['Height (m)', 'Diameter (m)', 'Mass (tonne)'],
            datasets: [{
              label: details.name,
              data: [details.height.meters, details.diameter.meters, details.mass.kg / 1000],
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
                'rgba(255, 159, 64, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(153, 102, 255, 0.5)',
              ],
              borderColor: [
                'rgba(255, 159, 64, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
              ],
              borderWidth: 1,
            }],
          });

          // Prepare polar area chart data
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
                // Add more colors as needed
              ],
            }],
          });
        })
        .catch(error => console.error('Fetching rocket details failed:', error));
    }
  }, [rocketId]);

  return (
    <div className="compareSheet">
      {rocketDetails && (
        <>
          <img src={rocketDetails.flickr_images[0]} alt={rocketDetails.name} style={{ width: '100%', height: '38vh' }} />
          <h2>{rocketDetails.name}</h2>
          <p>{rocketDetails.description}</p>
          {radarData.labels && (
            <ChartBlock chartType="radar" chartData={radarData} />
          )}
          {barData.labels && (
            <ChartBlock chartType="bar" chartData={barData} />
          )}
          {polarData.labels && (
            <ChartBlock chartType="polarArea" chartData={polarData} />
          )}
        </>
      )}
    </div>
  );
};

export default RocketComparison;
