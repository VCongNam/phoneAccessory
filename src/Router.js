import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Auth from './Pages/Log';
import PrivateRoutes from './PrivateRoutes';
import ProductList from './Pages/ProductList';
import ProductDetail from './Pages/ProductDetail';
import DashboardPage from './Pages/AdminDash';
import CartDetail from './Pages/CartDetail';

const AppRouter = () => {
    return (
        <Router>
            <div>
                {/* Example header at the bottom */}
                {/* Define Routes */}
                <Routes>
                    {/* Route for Home page */}
                    <Route element={<PrivateRoutes />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                    </Route>
                    <Route path="/" element={<Home />} exact />
                    {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
                    <Route path="/productlist" element={<ProductList />} />
                    <Route path="/productdetail/:id" element={<ProductDetail />} />
                    <Route path="/login" element={<Auth />} />
                    <Route path="/cart" element={<CartDetail />} />
                </Routes>
            </div>
        </Router>
    );
}

export default AppRouter;