import './Statblock.css';

<div className="statBlockBody">

</div>


function StatBlock({ title, currentValue, maxValue }) {
    return (
        <div className="statBlockBody">
            <h2>{title}</h2>
            <div className='scoreContainer'>
                <h1 className='score'>{currentValue}</h1>
                <h1 className='score'>/</h1>
                <h1 className='score'>{maxValue}</h1>
            </div>
        </div>
    );
}
  
  export default StatBlock;