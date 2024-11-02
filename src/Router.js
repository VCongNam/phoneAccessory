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
import DashboardPage1 from './Pages/SellerDashboard';
import CheckoutPage from './Pages/CheckOut';
import OrderConfirmation from './Pages/OrderCf';

const AppRouter = () => {
    return (
        <Router>
            <div>
                <Routes>
                    {/*Check điều kiện role_id*/}
                    <Route element={<PrivateRoutes requiredRole={2} />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                    </Route>
                    {/*Check điều kiện role_id*/}
                    <Route element={<PrivateRoutes requiredRole={3} />}>
                        <Route path="/SellerDashboard" element={<DashboardPage1 />} />
                    </Route>
                    <Route path="/adminlogin" element={<AdminAuth />} />
                    <Route path="/sellerlogin" element={<SellerAuth />} />
                    <Route path="/" element={<Home />} exact />
                    <Route path="/productlist" element={<ProductList />} />
                    <Route path="/productdetail/:id" element={<ProductDetail />} />
                    <Route path="/productlist/:id" element={<ProductList />} />
                    <Route path="/login" element={<Auth />} />
                    <Route path="/cart" element={<CartDetail />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/order-confirmation" element={<OrderConfirmation/>} />
                </Routes>
            </div>
        </Router>
    );
}

export default AppRouter;