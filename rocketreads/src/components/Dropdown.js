import React from 'react';
import './Dropdown.css';

// again following component-based-architecture I have one dropdown component that vcan be used anywhere for different purposes
// all the necessary props are passed to it
// id for css mainly; options to display the "list" of options; handleChnage for eventhandler; selectedvalue for selected value
const Dropdown = ({ id, options, handleChange, selectedValue }) => {
    return (
        <select className='dropBody' id={id} value={selectedValue} onChange={handleChange}>
        {options.map((option, index) => (
            <option key={index} value={option.value}>{option.label}</option>
        ))}
        </select>
    );
};

export default Dropdown;