import React, { useEffect, useState, useRef } from "react";
import { Layout, Row, Col, Card, List, Spin, Carousel } from "antd";
import { Modal, Button } from 'antd';
import { useParams } from 'react-router-dom';
import { supabase } from "../supabaseClient"; // Import Supabase client
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import Rating from './Rating'; // Import the Rating component
import { useNavigate } from "react-router-dom";
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


    // Handle add to cart
    const handleAddToCart = async () => {
        // Fetch the logged-in user
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
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

        const user_id = session.user.id; // Get the logged-in user's ID
        const product_id = product.product_id; // Get the current product's ID

        // Step 1: Check if the user already has a cart
        let cart_id;
        const { data: cart, error: cartError } = await supabase
            .from('cart')
            .select('cart_id')
            .eq('user_id', user_id)
            .single(); // Find the user's cart

        if (cartError && cartError.code !== 'PGRST116') { // 'PGRST116' is a common 'no rows found' error for Supabase
            console.error('Error checking cart:', cartError);
            alert('There was an issue adding the product to your cart. Please try again.');
            return;
        }

        if (!cart) {
            // Step 2: If the cart does not exist, create a new cart with cart_id = user_id
            const { data: newCart, error: newCartError } = await supabase
                .from('cart')
                .insert([
                    {
                        cart_id: user_id, // Set cart_id to user_id
                        user_id: user_id
                    }
                ])
                .select('cart_id')
                .single();

            if (newCartError) {
                console.error('Error creating cart:', newCartError);
                alert('Failed to create a cart. Please try again.');
                return;
            }

            cart_id = newCart.cart_id; // Get the cart_id from the newly created cart
        } else {
            // If the user has a cart, use the existing cart_id
            cart_id = cart.cart_id;
        }

        // Step 3: Check if the product is already in the cartdetail
        const { data: cartDetail, error: cartDetailError } = await supabase
            .from('cartdetail')
            .select('*')
            .eq('cart_id', cart_id)
            .eq('product_id', product_id)
            .single();

        if (cartDetailError && cartDetailError.code !== 'PGRST116') {
            console.error('Error checking cart details:', cartDetailError);
            alert('There was an issue adding the product to your cart. Please try again.');
            return;
        }

        if (cartDetail) {
            // Step 4: If the product is already in the cart, update the quantity
            const newQuantity = cartDetail.quantity + parseInt(quantity);
            const { data: updatedCartDetail, error: updateError } = await supabase
                .from('cartdetail')
                .update({ quantity: newQuantity })
                .eq('cart_id', cart_id)
                .eq('product_id', product_id);

            if (updateError) {
                console.error('Error updating cart detail:', updateError);
                alert('Failed to update product quantity in the cart. Please try again.');
            } else {
                alert(`Updated ${product.name} quantity to ${newQuantity} in the cart.`);
            }
        } else {
            // Step 5: If the product is not in the cart, insert a new row into cartdetail
            const { data: newCartDetail, error: insertError } = await supabase
                .from('cartdetail')
                .insert([
                    {
                        cart_id: cart_id, // Use the existing or newly created cart_id
                        product_id: product_id,
                        quantity: parseInt(quantity) // The selected quantity
                    }
                ]);

            if (insertError) {
                console.error('Error adding product to cart detail:', insertError);
                alert('Failed to add product to cart. Please try again.');
            } else {
                alert(`Added ${quantity} ${product.name}(s) to the cart.`);
            }
        }
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
