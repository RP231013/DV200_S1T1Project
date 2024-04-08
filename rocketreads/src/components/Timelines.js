import React, { useState, useEffect } from 'react';
import Dropdown from './Dropdown'; 
import ChartBlock from './ChartBlock'; 
import axios from 'axios';
import './Timelines.css';


const Timelines = () => {
  
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
          { value: 'launchesPerPad', label: 'Number of Rockets/Launches per Pad Over Time' },
          { value: 'crewCapacityOverTime', label: 'Crew Capacity Over Time' }
          
        ]}
        id="longerDropdown"
      />

      </div>
    </div>;

};

export default Timelines;