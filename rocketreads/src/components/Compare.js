import React, { useState, useEffect } from 'react';
import Dropdown from './Dropdown';
import RocketComparison from './RocketComparison';
import LaunchComparison from './LaunchComparison';
import './Compare.css';
import axios from 'axios';

const Compare = () => {
  // I use state variables to store data for later use
  const [selectedType, setSelectedType] = useState('');
  const [objectOptions, setObjectOptions] = useState([]);
  const [selectedObject1, setSelectedObject1] = useState('');
  const [selectedObject2, setSelectedObject2] = useState('');

  // hardcoded/predefined options for objects to be compared
  const objectTypes = [
    { value: 'null', label: 'Select Object' },
    { value: 'rockets', label: 'Rocket' },
    { value: 'launchpads', label: 'Launchpad' }
  ];

  // fethces object data from API when selected item in dropdown changes
  useEffect(() => {
    if (selectedType) {
      axios.get(`https://api.spacexdata.com/v4/${selectedType}`)
        .then(response => {
          const options = response.data.map(item => ({
            value: item.id,
            //uses name or id depending on availability
            label: item.name || item.id 
          }));
          setObjectOptions(options);
        })
        .catch(error => {
          console.error('error fetching data:', error);
          setObjectOptions([]);
        });
    }
  }, [selectedType]); // effect depends on selected type, so it is here

  //eventhandler, handles changes to dropdown and resets selections
  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setSelectedObject1('');
    setSelectedObject2('');
    setObjectOptions([]);
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
        {/* only renders following if value truthy - conditional rendering react */}
        {selectedType && <>
          <Dropdown 
            id="object1"
            options={objectOptions}
            selectedValue={selectedObject1}
            // arro function for event, also updates electedObject state "saving" user selection
            handleChange={(e) => setSelectedObject1(e.target.value)}
          />
          <Dropdown 
            id="object2"
            options={objectOptions}
            selectedValue={selectedObject2}
            handleChange={(e) => setSelectedObject2(e.target.value)}
          />
        </>}
        
        {/* basically means will only render if both dropdowns has value and type is rocket */}
        {selectedType && selectedObject1 && (
          selectedType === 'rockets' && <RocketComparison rocketId={selectedObject1} />
        )}
        {selectedType && selectedObject2 && (
          selectedType === 'rockets' && <RocketComparison rocketId={selectedObject2} />
        )}
        
        {/* basically means will only render if both dropdowns has value and type is launchpad */}
        {selectedObject1 && selectedType === 'launchpads' && (
          <LaunchComparison launchpadId={selectedObject1} />
        )}
        {selectedObject2 && selectedType === 'launchpads' && (
          <LaunchComparison launchpadId={selectedObject2} />
        )}

      </div>
    </div>
  );
};

export default Compare;
