import React, { useEffect, useState } from "react";
import { Layout, Row, Col, Card, List, Spin, Carousel } from "antd";
import { useParams } from 'react-router-dom';
import { supabase } from "../supabaseClient"; // Import Supabase client
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import Rating from './Rating'; // Import the Rating component
import "./CSS/ProductDetail.css";

const { Content } = Layout;
const { Meta } = Card;


function ProductDetail() {
    const [quantity, setQuantity] = useState(1);
    const { id } = useParams(); // Lấy id từ URL
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    // Hàm lấy danh sách sản phẩm từ Supabase
    useEffect(() => {
        const fetchProduct = async () => {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('product_id', id) // Lấy sản phẩm có id tương ứng
                .single();

            if (error) {
                console.error('Error fetching product:', error);
            } else {
                setProduct(data); // Cập nhật chi tiết sản phẩm
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
    const handleAddToCart = () => {
        alert(`Added ${quantity} ${product.name}(s) to the cart.`);
    };

    const handleRate = (rating) => {
        console.log(`Rated ${product.name}: ${rating} stars`);
        // Here you can send the rating to your backend (e.g., Supabase) to store it
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
                        <p className="product-price">{product.sell_price}VND</p>
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
                
            </div>
            <Footer></Footer>
        </div>

    );
};

export default ProductDetail;
