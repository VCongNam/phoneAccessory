import React from 'react';
import { Link } from 'react-router-dom';
import './CSS/ProductList.css';
import Header from '../Components/Header/Header';
import Footer from '../Components/Footer/Footer';


const ProductList = () => {
    // Example product data
    const products = [
        {
            id: 1,
            name: "Premium Phone Case",
            price: "29.000",
            imageUrl: "./Image/group_170_1_1.jpg"
        },
        {
            id: 2,
            name: "Wireless Charger",
            price: "19.000",
            imageUrl: "./Image/group_170_1_1.jpg"
        },
        {
            id: 3,
            name: "Screen Protector",
            price: "9.000",
            imageUrl: "./Image/group_170_1_1.jpg"
        }
    ];
    const list = [
        {
            id: 1,
            name: "sạc điện thoại",
        },
        {
            id: 2,
            name: "sạc dự phòng",
        },
        {
            id: 3,
            name: "tai nghe",
        },
        {
            id: 4,
            name: "ốp điện thoại",
        },
        {
            id: 3,
            name: "kính cường lực",
        },
        {
            id: 3,
            name: "que chọc sim",
        }
    ];

    return (
        <div>
          
            <div className="list">
            {list.map(product => (
                <div className='list-div' key={product.id}>
                    <button>{product.name}</button>
                </div>
            ))}
            </div>
            <div className="product-list">
                {products.map((product) => (
                    <div key={product.id} className="product-item">
                        <img src={product.imageUrl} alt={product.name} />
                        <h2>{product.name}</h2>
                        <p>{product.price}VND</p>
                        {/* Link to individual product detail page */}
                        <Link to={`/product/${product.id}`} className="view-details">
                            View Details
                        </Link>
                    </div>
                ))}
            </div>
           
        </div>

    );
};

export default ProductList;
