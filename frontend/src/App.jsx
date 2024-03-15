import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Bookings from './pages/Bookings';
import NotFound from './components/NotFound';
import Homepage from './pages/Homepage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="App" >
        <Navbar/>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="*" element={<NotFound />} />

        {/* Footer Component */}
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
