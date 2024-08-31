import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import ItemDetail from './ItemDetail';
import ItemList from './ItemList';
import Footer from './Footer';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="header">
          <img src={`${process.env.PUBLIC_URL}/price-radar-logo.webp`} className="App-logo" alt="Price Radar Logo" />
          <span className="header-tagline-big">Price Radar</span>
          <span className="header-tagline-small">Your everything price tracker</span>
        </header>
        <Routes>
          <Route path="/" element={<ItemList />} />
          <Route path="/items/:id" element={<ItemDetail />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;