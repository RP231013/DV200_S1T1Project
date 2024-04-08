import './Statblock.css';

<div className="statBlockBody">

</div>


function StatBlock({ title, currentValue, maxValue }) {
    return (
        <div className="statBlockBody">
            <h2>{title}</h2>
            <div className='scoreContainer'>
                <h1 className='score' id='teller'>{currentValue}</h1>
                <h1 className='score' id='slash' >/</h1>
                <h1 className='score' id='noemer' >{maxValue}</h1>
            </div>
        </div>
    );
}
  
  export default StatBlock;