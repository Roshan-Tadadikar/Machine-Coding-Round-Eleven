import logo from './logo.svg';
import './App.css';
import { Routes,Route } from 'react-router-dom';
import Home from './Pages/Home';

function App() {
  return (
    <div className="App">
      <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/singlePage" element={<Home/>}/>
    <Route path="/starred" element={<Home/>}/>
    <Route path="/watchList" element={<Home/>}/>
        </Routes>
    </div>
  );
}

export default App;
