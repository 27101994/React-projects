
import './App.css';
import Navbar from './components/Navbar';
import checkAuth from './components/auth/checkAuth';

function App() {
  return (
    <div className="App">
      <Navbar/>
      <h1>Medical Store.</h1>
      <img src='https://media.tenor.com/kRoWlxwkAysAAAAM/pharmacist.gif' width={500} height={450}/>
    </div>
  );
}

export default checkAuth(App);
