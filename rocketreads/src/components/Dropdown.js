import React from 'react';
import './Dropdown.css';

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