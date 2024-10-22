import React, { useEffect, useState, useRef } from "react";
import { Layout, Row, Col, Card, List, Spin, Carousel } from "antd";
import { Modal, Button } from 'antd';
import { useParams } from 'react-router-dom';
import { supabase } from "../supabaseClient"; // Import Supabase client
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import Rating from './Rating'; // Import the Rating component
import { useNavigate } from "react-router-dom";
import { decoder64 } from '../Components/Base64Encoder/Base64Encoder';
import { toast, ToastContainer } from 'react-toastify'; // Import Toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles
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
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null); // Thêm state cho ảnh chính
    const navigate = useNavigate();

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const fetchUserAndCart = async () => {
        try {
            const userInfoCookie = getCookie('token');
            if (userInfoCookie) {
                const decodedUserInfo = JSON.parse(decoder64(userInfoCookie));
                setUser(decodedUserInfo); // Cập nhật state user
            }
        } catch (error) {
            console.error("Error fetching user info:", error);
            toast.error("Lỗi lấy thông tin người dùng: " + error.message); // Toast in Vietnamese
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            const { data: product, proerror } = await supabase
                .from('products')
                .select('*')
                .eq('product_id', id)
                .single();

            if (proerror) {
                console.error('Error fetching product:', proerror);
            } else {
                setProduct(product);
                setSelectedImage(product.img[0]); // Đặt ảnh đầu tiên làm ảnh chính
            }

            const cateid = product.cate_id;
            const { data: products, error } = await supabase
                .from('products')
                .select('*')
                .eq('cate_id', cateid);

            if (error) {
                console.error('Error fetching product:', error);
            } else {
                setProducts(products);
            }

            setLoading(false);
        };
        fetchUserAndCart();
        fetchProduct();
    }, [id]);

    if (loading) {
        return <p>Đang tải thông tin sản phẩm...</p>; // Vietnamese for "Loading product details..."
    }

    if (!product) {
        return <p>Không tìm thấy sản phẩm.</p>; // Vietnamese for "Product not found."
    }

    const handleQuantityChange = (e) => {
        setQuantity(e.target.value);
    };

    const handleAddToCart = async () => {
        if (getCookie('token') == null) {
            Modal.confirm({
                title: 'Bạn chưa đăng nhập',
                content: 'Đăng nhập trước khi thêm sản phẩm vào giỏ hàng.',
                okText: 'OK',
                cancelText: 'Đăng nhập',
                onCancel: () => {
                    navigate('/login');
                }
            });
            return;
        }
        const userid = user.user_id;
        const fetchCart = async () => {
            const { data: cart, error } = await supabase
                .from('cart')
                .select('*')
                .eq('user_id', userid)
                .single();
            if (error) {
                console.error("cart error:", error);
                toast.error("Lỗi giỏ hàng: " + error.message); // Toast in Vietnamese
            } else {
                setCart(cart);
            }
            setLoading(false);
        };
        fetchCart();

        if (cart) {
            const product_id = product.product_id;
            try {
                const { data: cart_item, error: cartDetailError } = await supabase
                    .from('cart_item')
                    .select('*')
                    .eq('cart_id', cart.id)
                    .eq('product_id', product_id)
                    .single();

                if (cart_item) {
                    const newQuantity = cart_item.quantity + quantity;
                    const { error: updateError } = await supabase
                        .from('cart_item')
                        .update({ quantity: newQuantity })
                        .eq('cart_id', cart.id)
                        .eq('product_id', product_id);
                    if (updateError) {
                        console.error('Error updating cart detail:', updateError);
                        toast.error('Lỗi cập nhật giỏ hàng: ' + updateError.message, {
                            style: { backgroundColor: '#f5222d', color: '#fff' } // Custom error style
                        });
                    } else {
                        toast.success(`Cập nhật số lượng sản phẩm ${product.name} lên ${newQuantity}.`, {
                            style: { backgroundColor: '#52c41a', color: '#fff' } // Custom success style
                        });
                    }
                } else {
                    const { error: insertError } = await supabase
                        .from('cart_item')
                        .insert({ cart_id: cart.id, product_id: product_id, quantity: quantity });
                    if (insertError) {
                        console.error('Error adding product to cart:', insertError);
                        toast.error('Lỗi thêm sản phẩm vào giỏ hàng: ' + insertError.message, {
                            style: { backgroundColor: '#f5222d', color: '#fff' }
                        });
                    } else {
                        toast.success(`Đã thêm ${quantity} ${product.name} vào giỏ hàng.`, {
                            style: { backgroundColor: '#52c41a', color: '#fff' }
                        });
                    }
                }
            } catch (error) {
                console.error('Error adding to cart:', error);
                toast.error('Lỗi thêm vào giỏ hàng: ' + error.message, {
                    style: { backgroundColor: '#f5222d', color: '#fff' }
                });
            }
        }
    };


    const handleRate = (rating) => {
        console.log(`Rated ${product.name}: ${rating} stars`);
    };

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    // Thay đổi ảnh chính khi người dùng bấm vào ảnh nhỏ
    const handleImageClick = (imgUrl) => {
        setSelectedImage(imgUrl);
    };

    return (
        <div>
            <Header />
            <div>
                <ToastContainer /> {/* Toast container to show toasts */}
                <div className="product-container">
                    <Card
                        hoverable
                        cover={
                            <img
                                alt={product.name}
                                src={selectedImage} // Hiển thị ảnh chính được chọn
                                style={{ cursor: "pointer", width: '100%', maxHeight: '500px', objectFit: 'cover' }}
                            />
                        }
                    />
                    <div className="product-thumbnails">
                        {/* Hiển thị tất cả ảnh nhỏ */}
                        {product.img.map((imgUrl, index) => (
                            <img
                                key={index}
                                src={imgUrl}
                                alt={`Thumbnail ${index}`}
                                className={`thumbnail ${selectedImage === imgUrl ? 'selected' : ''}`} // Đánh dấu ảnh được chọn
                                onClick={() => handleImageClick(imgUrl)}
                                style={{ cursor: 'pointer', width: '80px', margin: '5px', border: selectedImage === imgUrl ? '2px solid #1890ff' : '1px solid #d9d9d9' }}
                            />
                        ))}
                    </div>
                    <div className="product-details">
                        <h1>{product.name}</h1>
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
                            onChange={handleQuantityChange}
                        />
                        <button onClick={handleAddToCart}>Thêm vào giỏ</button>
                    </div>
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
                                            src={product.img[0]}
                                            style={{ height: "auto", objectFit: "cover" }}
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

            <Footer />
        </div>
    );
};

export default ProductDetail;
