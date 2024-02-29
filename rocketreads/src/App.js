
import NavBar from './components/NavBar'
import Dashboard from './components/Dashboard';

import './App.css';

function App() {
  return (
    <div className="App-container">
      <NavBar />

      <div className="page-content">
        <Dashboard/>
        
      </div>
      
      
    </div>
  );
}

export default App;
