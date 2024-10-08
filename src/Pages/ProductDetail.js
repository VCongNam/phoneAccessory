import React, { useState } from "react";
import "./CSS/ProductDetail.css"
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import demo from "./images/download.jpg";

function ProductDetail() {
    const [quantity, setQuantity] = useState(1);

    // Example product data
    const product = {
        id: 1,
        name: "Tai nghe Bluetooth Apple AirPods 3 2022 sạc có dây | Chính hãng Apple Việt Nam",
        price: "300.000",
        description: "Apple Airpods 3 2022 là mẫu tai nghe bluetooth mới nhất đến từ ông trùm công nghệ Apple. Tai nghe sở hữu thiết kế nhỏ gọn cùng rất nhiều công nghệ hiện đại tai nghe mang tới cho người dùng trải nghiệm âm thanh cực sống động. Dưới đây là điểm nổi bật trên Airpod 3 2022 mà bạn không nên bỏ qua.",
        imageUrl: demo
    };

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
}

export default ProductDetail;
