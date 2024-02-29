import React, { useRef } from 'react';
import './Statblock.css';

function StatBlock() {
    return (
        <div className="statBlockBody">
            <h2>No. Rockets Active</h2>

            <div className='scoreContainer'>
                <h1 id='teller' className='score'>90</h1>
                <h1 id='slash' className='score'>/</h1>
                <h1 id='noemer' className='score'>180</h1>
            </div>

            
        </div>
    );
  }
  
  export default StatBlock;