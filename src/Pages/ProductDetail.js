import React, { useEffect, useState } from "react";
import { Layout, Row, Col, Card, List, Spin, Carousel } from "antd";
import { supabase } from "../supabaseClient"; // Import Supabase client
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import "./CSS/ProductList.css";

const { Content } = Layout;
const { Meta } = Card;

function ProductDetail() {
    const [products, setProducts] = useState([]);
 const [categories, setCategories] = useState([]);
 const [loading, setLoading] = useState(true);
 const [selectedCategory, setSelectedCategory] = useState(null); // Loại sản phẩm được chọn

 // Hàm lấy danh sách sản phẩm từ Supabase
 const fetchProducts = async () => {
   const { data, error } = await supabase.from("products").select("*");
   if (error) {
     console.error("Error fetching products:", error);
   } else {
     setProducts(data);
   }
   setLoading(false);

    // Handle quantity change
    const handleQuantityChange = (e) => {
        setQuantity(e.target.value);
    };

    // Handle add to cart
    const handleAddToCart = () => {
        alert(`Added ${quantity} ${product.name}(s) to the cart.`);
    };

    return (
        <div>
            <Header></Header>
            <div>
                <div className="product-container">
                    <div className="product-image">
                        <img src={product.imageUrl} alt={product.name} />
                    </div>
                    <div className="product-details">
                        <h1>{product.name}</h1>
                        <p className="product-price">{product.price}VND</p>
                        <label htmlFor="quantity">Quantity:</label>

                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            min="1"
                            value={quantity}
                            onChange={handleQuantityChange} />
                        <button onClick={handleAddToCart}>Add to Cart</button>
                        <p className="product-description">{product.description}</p>

                    </div>

                </div>


            </div>
            <Footer></Footer>
        </div>

    );
}};

export default ProductDetail;
