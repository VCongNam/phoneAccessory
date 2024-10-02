import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Auth from './Pages/Log';
import ProductList from './Pages/ProductList';
import Cart from './Pages/Cart';
import AppHeader from './Components/Header/Header';
import AppFooter from './Components/Footer/Footer'; // Example of the footer you might want to include
// Import other components/pages if you have them

const App = () => {
  return (
    <Router>
     
      <div>
         {/* Example header at the bottom */}
         <AppHeader/>
        {/* Define Routes */}
        <Routes>
          {/* Route for Home page */}
          <Route path="/" element={<Home />} />

          {/* You can add more routes here for other pages */}
          <Route path="/productlist" element={<ProductList />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/cart"  element={<Cart/>}/>
        </Routes>

        {/* Example footer at the bottom */}
        <AppFooter />
      </div>
    </Router>
  );
};

export default App;