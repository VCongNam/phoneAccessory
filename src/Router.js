import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Auth from './Pages/Log';
import PrivateRoutes from './PrivateRoutes';
import ProductList from './Pages/ProductList';
import ProductDetail from './Pages/ProductDetail';
import DashboardPage from './Pages/AdminDash';
import CartDetail from './Pages/CartDetail';
import Profile from './Pages/Profile';
import AdminAuth from './Pages/AdminLogin';
import SellerAuth from './Pages/SellerLogin';
import SellerProductList from './Pages/SellerProductList';

const AppRouter = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route element={<PrivateRoutes />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                    </Route>
                    <Route path="/adminlogin" element={<AdminAuth />}/>
                    <Route path="/sellerlogin" element={<SellerAuth />}/>
                    <Route path="/" element={<Home />} exact />
                    <Route path="/productlist" element={<ProductList />} />
                    <Route path="/productdetail/:id" element={<ProductDetail />} />
                    <Route path="/login" element={<Auth />} />
                    <Route path="/cart" element={<CartDetail />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/sellerproductlist" element={<SellerProductList />} />
                </Routes>
            </div>
        </Router>
    );
}

export default AppRouter;