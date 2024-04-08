import './Statblock.css';
// simple statistic block for showing a fraction data
// sticking with reusable component model, can be used anywhere, just pass props
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