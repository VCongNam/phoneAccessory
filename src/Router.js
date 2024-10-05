import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Auth from './Pages/Log';
import ProductList from './Pages/ProductList';
import AppHeader from './Components/Header/Header';
import AppFooter from './Components/Footer/Footer';

const AppRouter = () => {
    return (
        <Router>
            <div>
                {/* Example header at the bottom */}
                <AppHeader />
                {/* Define Routes */}
                <Routes>
                    {/* Route for Home page */}
                    <Route path="/" element={<Home/>} />
                    {/* You can add more routes here for other pages */}
                    <Route path="/productlist" element={<ProductList />} />
                    <Route path="/login" element={<Auth />} />
                </Routes>

                {/* Example footer at the bottom */}
                <AppFooter />
            </div>
        </Router>
    );
}

export default AppRouter;