import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GamePage from './pages/GamePage';
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin';

const App = () => {

  return (
    // Set up routes to pages
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/gamepage" element={<GamePage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App