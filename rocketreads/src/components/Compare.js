import React, { useState, useEffect } from 'react';
import Dropdown from './Dropdown';
import RocketComparison from './RocketComparison';
import axios from 'axios';

const Compare = () => {
  const [selectedType, setSelectedType] = useState('');
  const [objectOptions, setObjectOptions] = useState([]);
  const [selectedObject1, setSelectedObject1] = useState('');
  const [selectedObject2, setSelectedObject2] = useState('');



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
        

        {selectedType && selectedObject1 && (
          selectedType === 'rockets' && <RocketComparison rocketId={selectedObject1} />
          // Add similar lines for other types
        )}
        {selectedType && selectedObject2 && (
          selectedType === 'rockets' && <RocketComparison rocketId={selectedObject2} />
          // Repeat for other types
        )}
        

          



      </div>
    </div>
  );
};

export default Compare;
