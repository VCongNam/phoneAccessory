import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppHeader from './Components/Header/Header';
import AppFooter from './Components/Footer/Footer';
import Home from './Pages/Home';
import Auth from './Pages/Log';
import ProductList from './Pages/ProductList';
import DashboardPage from './Pages/AdminDash';

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
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/productlist" element={<ProductList />} />
                    <Route path="/login" element={<Auth />} />
                </Routes>
                <AppFooter />
            </div>
        </Router>
    );
}

export default AppRouter;