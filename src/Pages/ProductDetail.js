import React, { useEffect, useState, useRef } from "react";
import { Layout, Row, Col, Card, List, Spin, Carousel } from "antd";
import { Modal, Button } from 'antd';
import { useParams } from 'react-router-dom';
import { supabase } from "../supabaseClient"; // Import Supabase client
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import Rating from './Rating'; // Import the Rating component
import { useNavigate } from "react-router-dom";
import { getToken } from "../Components/GetToken/GetToken";
import CartDetail from "./CartDetail";
import "./CSS/ProductDetail.css";

const { Content } = Layout;
const { Meta } = Card;


function ProductDetail() {
    const [quantity, setQuantity] = useState(1);
    const { id } = useParams(); // Lấy id từ URL
    const [product, setProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const carouselRef = useRef(); // Dùng để điều khiển Carousel
    const navigate = useNavigate();


    // Hàm lấy danh sách sản phẩm từ Supabase
    useEffect(() => {
        const fetchProduct = async () => {
            const { data: product, proerror } = await supabase
                .from('products')
                .select('*')
                .eq('product_id', id) // Lấy sản phẩm có id tương ứng
                .single();

            if (proerror) {
                console.error('Error fetching product:', error);
            } else {
                setProduct(product); // Cập nhật chi tiết sản phẩm
            }

            const cateid = product.cate_id;
            const { data: products, error } = await supabase
                .from('products')
                .select('*')
                .eq('cate_id', cateid) // Lấy sản phẩm có id tương ứng

            if (error) {
                console.error('Error fetching product:', error);
            } else {
                setProducts(products); // Cập nhật chi tiết sản phẩm
            }

            setLoading(false);
        };
        fetchProduct();
    }, [id]);

    if (loading) {
        return <p>Loading product details...</p>;
    }

    if (!product) {
        return <p>Product not found.</p>;
    }

    // Handle quantity change
    const handleQuantityChange = (e) => {
        setQuantity(e.target.value);
    };

    const checklogin = () => {
        const token = getToken();
        if (token != null) {
            return true;
        } else {
            return false;
        }
    };


    // Handle add to cart
    const handleAddToCart = async () => {
        if (!checklogin) {
            // Show modal with two buttons: "OK" and "Login"
            Modal.confirm({
                title: 'Bạn chưa đăng nhập',
                content: 'Đăng nhập trước khi thêm sản phẩm vào giỏ hàng.',
                okText: 'OK', // First button to close the modal
                cancelText: 'Đăng nhập', // Second button to navigate to login page
                onCancel: () => {
                    navigate('/login'); // Redirect to login page if "Login" button is clicked
                }
            });
            return;
        }
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        const userid = user.id;
        const product_id = product.product_id;
        alert(userid);
    };

    const handleRate = (rating) => {
        console.log(`Rated ${product.name}: ${rating} stars`);
        // Here you can send the rating to your backend (e.g., Supabase) to store it
    };

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    return (
        <div>
            <Header />
            <div>

                <div className="product-container">
                    <div className="product-image">
                        <img
                            alt={product.name}
                            src={product.img}
                            style={{ height: "200px", objectFit: "cover" }}
                        />
                    </div>
                    <div className="product-details">
                        <h1>{product.name}</h1>
                        {/* Rating Component */}
                        <div className="product-rating">
                            <Rating totalStars={5} onRate={handleRate} />
                        </div>
                        <p className="product-price">{formatPrice(product.sell_price)} VND</p>
                        <p className="product-description">{product.des}</p>

                        <label htmlFor="quantity">Số lượng:</label>

                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            min="1"
                            value={quantity}
                            onChange={handleQuantityChange} />
                        <button onClick={handleAddToCart}>Thêm vào giỏ</button>

                    </div>
                </div>
                <div className="product-carousel">
                    <h2 className="carousel-title">Sản phẩm cùng thể loại</h2>
                    <Carousel
                        ref={carouselRef}
                        dots={false}
                        slidesToShow={4}
                        slidesToScroll={1}
                        arrows={false}
                        className="product-slider"
                    >
                        {products.map((product) => (
                            <div key={product.id} className="product-card-container">
                                <Card
                                    hoverable
                                    cover={
                                        <img
                                            alt={product.name}
                                            src={product.img}
                                            style={{ height: "200px", objectFit: "cover" }}
                                        />
                                    }
                                    className="product-card"
                                >
                                    <Meta
                                        title={product.name}
                                        description={`Giá: ${formatPrice(product.sell_price)} VNĐ`}
                                    />
                                </Card>
                            </div>
                        ))}
                    </Carousel>
                </div>
            </div>
            <Footer></Footer>
        </div>

    );
};

export default ProductDetail;
