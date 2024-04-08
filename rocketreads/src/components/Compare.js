import React, { useState, useEffect } from 'react';
import Dropdown from './Dropdown';
import ChartBlock from './ChartBlock';
import axios from 'axios';

const Compare = () => {
  const [selectedType, setSelectedType] = useState('');
  const [objectOptions, setObjectOptions] = useState([]);
  const [selectedObject1, setSelectedObject1] = useState('');
  const [selectedObject2, setSelectedObject2] = useState('');

  const [rocketDetails, setRocketDetails] = useState({ rocket1: null, rocket2: null });
  const [rocket1RadarData, setRocket1RadarData] = useState(null);
  const [rocket2RadarData, setRocket2RadarData] = useState(null);
  const [rocket1BarData, setRocket1BarData] = useState(null);
  const [rocket2BarData, setRocket2BarData] = useState(null);
  const [rocket1PolarData, setRocket1PolarData] = useState(null);
  const [rocket2PolarData, setRocket2PolarData] = useState(null);

  const objectTypes = [
    { value: 'null', label: 'Select Object' },
    { value: 'rockets', label: 'Rocket' },
    { value: 'launches', label: 'Launch' },
    { value: 'launchpads', label: 'Launchpad' },
    { value: 'dragons', label: 'Dragon' }
  ];

  useEffect(() => {
    if (selectedType) {
      axios.get(`https://api.spacexdata.com/v4/${selectedType}`)
        .then(response => {
          const options = response.data.map(item => ({
            value: item.id,
            label: item.name || item.id
          }));
          setObjectOptions(options);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          setObjectOptions([]);
        });
    }
  }, [selectedType]);

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setSelectedObject1('');
    setSelectedObject2('');
    setObjectOptions([]);
  };

  const fetchAndCompareRockets = () => {
    if (selectedType === 'rockets' && selectedObject1 && selectedObject2) {
      Promise.all([
        axios.get(`https://api.spacexdata.com/v4/rockets/${selectedObject1}`),
        axios.get(`https://api.spacexdata.com/v4/rockets/${selectedObject2}`)
      ])
      .then(([response1, response2]) => {
        const rocket1Details = response1.data;
        const rocket2Details = response2.data;
        setRocketDetails({ rocket1: rocket1Details, rocket2: rocket2Details });
      
        // Radar chart data for Rocket 1
        const rocket1RadarChartData = {
          labels: ['Height (m)', 'Diameter (m)', 'Mass (kilo-tonne)'],
          datasets: [
            {
              label: rocket1Details.name,
              data: [
                rocket1Details.height.meters,
                rocket1Details.diameter.meters,
                rocket1Details.mass.kg / 10000, // Convert kg to tonnes
              ],
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
            },
          ],
        };
        setRocket1RadarData(rocket1RadarChartData);
      
        // Radar chart data for Rocket 2
        const rocket2RadarChartData = {
          labels: ['Height (m)', 'Diameter (m)', 'Mass (kilo-tonne)'],
          datasets: [
            {
              label: rocket2Details.name,
              data: [
                rocket2Details.height.meters,
                rocket2Details.diameter.meters,
                rocket2Details.mass.kg / 10000, // Convert kg to tonnes
              ],
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
            },
          ],
        };
        setRocket2RadarData(rocket2RadarChartData);


        // Bar chart data for Rocket 1
        const rocket1BarChartData = {
          labels: ['First Stage Sea-level Thrust', 'First Stage Vacuum Thrust', 'Second Stage Thrust'],
          datasets: [{
            label: rocket1Details.name + ' Thrust (kN)',
            data: [
              rocket1Details.first_stage.thrust_sea_level.kN,
              rocket1Details.first_stage.thrust_vacuum.kN,
              rocket1Details.second_stage.thrust.kN,
            ],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 1
          }]
        };
        setRocket1BarData(rocket1BarChartData);

        // Bar chart data for Rocket 1
        const rocket2BarChartData = {
          labels: ['First Stage Sea-level Thrust', 'First Stage Vacuum Thrust', 'Second Stage Thrust'],
          datasets: [{
            label: rocket2Details.name + ' Thrust (kN)',
            data: [
              rocket2Details.first_stage.thrust_sea_level.kN,
              rocket2Details.first_stage.thrust_vacuum.kN,
              rocket2Details.second_stage.thrust.kN,
            ],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 1
          }]
        };
        setRocket2BarData(rocket2BarChartData);


        const rocket1PayloadLabels = rocket1Details.payload_weights.map(p => p.name);
        const rocket1PayloadWeights = rocket1Details.payload_weights.map(p => p.kg);
        
        const rocket1PolarChartData = {
          labels: rocket1PayloadLabels,
          datasets: [{
            label: rocket1Details.name + ' Payload Weights (kg)',
            data: rocket1PayloadWeights,
            backgroundColor: [
              'rgba(255, 99, 132, 0.5)',
              'rgba(54, 162, 235, 0.5)',
              'rgba(255, 206, 86, 0.5)',
              
            ]
          }]
        };
        setRocket1PolarData(rocket1PolarChartData);

        const rocket2PayloadLabels = rocket2Details.payload_weights.map(p => p.name);
        const rocket2PayloadWeights = rocket2Details.payload_weights.map(p => p.kg);
        
        const rocket2PolarChartData = {
          labels: rocket2PayloadLabels,
          datasets: [{
            label: rocket2Details.name + ' Payload Weights (kg)',
            data: rocket2PayloadWeights,
            backgroundColor: [
              'rgba(255, 99, 132, 0.5)',
              'rgba(54, 162, 235, 0.5)',
              'rgba(255, 206, 86, 0.5)',
              
            ]
          }]
        };
        setRocket2PolarData(rocket2PolarChartData);



      })
      .catch(error => console.error('Error fetching rocket details:', error));
    }
  };

  return (
    <div>
      <div className="compare-header">
        <h1>Compare</h1>
        <p>Welcome to the Compare page. Firstly select what you'd like to compare then the specific objects you want to compare.</p>
      </div>
      <div className='compare-content'>
        <Dropdown 
          id="objectType"
          options={objectTypes}
          selectedValue={selectedType}
          handleChange={handleTypeChange}
        />
        {selectedType && <>
          <Dropdown 
            id="object1"
            options={objectOptions}
            selectedValue={selectedObject1}
            handleChange={(e) => setSelectedObject1(e.target.value)}
          />
          <Dropdown 
            id="object2"
            options={objectOptions}
            selectedValue={selectedObject2}
            handleChange={(e) => setSelectedObject2(e.target.value)}
          />
        </>}
        

        <button className='compareBtn' onClick={fetchAndCompareRockets} disabled={!selectedObject1 || !selectedObject2}>Compare</button>

        {rocketDetails.rocket1 && (
          <div className='compareSheet'>
            <img src={rocketDetails.rocket1.flickr_images[0]} alt={rocketDetails.rocket1.name} style={{ width: '100%', height: '40vh' }} />
            <h2>{rocketDetails.rocket1.name}</h2>
            <p>{rocketDetails.rocket1.description}</p>
            {rocket1RadarData && (
              <ChartBlock chartType="radar" chartData={rocket1RadarData} />
            )}
            {rocket1BarData && (
              <ChartBlock chartType="bar" chartData={rocket1BarData} />
            )}
            {rocket1PolarData && (
              <ChartBlock chartType="polarArea" chartData={rocket1PolarData} />
            )}
          </div>
        )}

        {rocketDetails.rocket2 && (
          <div className='compareSheet'>
            <img src={rocketDetails.rocket2.flickr_images[0]} alt={rocketDetails.rocket2.name} style={{ width: '100%', height: '40vh' }} />
            <h2>{rocketDetails.rocket2.name}</h2>
            <p>{rocketDetails.rocket2.description}</p>
            {rocket2RadarData && (
              <ChartBlock chartType="radar" chartData={rocket2RadarData} />
            )}
            {rocket2BarData && (
              <ChartBlock chartType="bar" chartData={rocket2BarData} />
            )}
            {rocket2PolarData && (
              <ChartBlock chartType="polarArea" chartData={rocket2PolarData} />
            )}
          </div>
        )}
        

          



      </div>
    </div>
  );
};

export default Compare;
