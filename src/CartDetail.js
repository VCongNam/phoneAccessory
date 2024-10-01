import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import "./Pages/CSS/CartDetail.css";
import { data } from "framer-motion/client";

const CartDetail = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);


    const handleQuantityChange = (e) => {
        setQuantity(e.target.value);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch all products
                const { data, error } = await supabase
                    .from("products")
                    .select("*");

                // Handle errors
                if (error) {
                    alert("Error fetching accounts: " + error.message);
                } else {
                    setProducts(data);
                }
            } catch (error) {
                alert("Unexpected error fetching accounts: " + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const fetchProductQuantity = async (cartId, productId) => {
        try {
            const { data, error } = await supabase
                .from('cart_item')
                .select('quantity')
                .eq('cart_id', cartId) // Fetch quantity for the specific cart and product
                .eq('product_id', productId)
                .single(); // Ensure we only get a single result
    
            if (error) {
                console.error("Error fetching quantity:", error);
                return null; // Return null in case of an error
            }
    
            return data?.quantity ?? 0; // Return the quantity or default to 0 if not found
        } catch (err) {
            console.error("Error during fetch:", err);
            return null; // Handle unexpected errors
        }
    };

    const handleAddToCart = async (product) => {
        const currentQuantity = await fetchProductQuantity(1, product.product_id); // Fetch quantity from cart

        if (currentQuantity !== null) {
            const newQuantity = currentQuantity + 1;
            if (newQuantity >= 0) {
                const { data, error } = await supabase
                .from("cart_item")
                // .where({ cart_id: 1, product_id: product.product_id })
                .upsert(
                    {
                        cart_id: 1,  // Assuming this is a static cart ID, replace it with a dynamic ID if needed
                        product_id: product.product_id,
                        quantity: newQuantity
                    },
                    {
                        onConflict: ['cart_id', 'product_id'], // Specify the unique constraint columns
                    }
                );   
                if (error) {
                    console.error("Loi insert");
                } else {
                    const newProducts = [...products];
                    const productIndex = newProducts.findIndex(
                        (p) => p.id === product.id
                    );
                    if (productIndex < 0) {
                        newProducts.push({ ...product, quantity: quantity });
                    } else {
                        newProducts[productIndex].quantity += quantity;
                    }
                    setProducts(newProducts);
                    setQuantity(newQuantity);
                }
            }
        }
        else {
            console.error("Loi abc");
        }
    };

    const handleRemoveFromCart = async (product) => {
        const currentQuantity = await fetchProductQuantity(1, product.product_id); // Fetch quantity from cart

        if (currentQuantity !== null) {
            const newQuantity = currentQuantity - 1;
            if (newQuantity >= 0) {
                const { data, error } = await supabase
                .from("cart_item")
                // .where({ cart_id: 1, product_id: product.product_id })
                .upsert(
                    {
                        cart_id: 1,  // Assuming this is a static cart ID, replace it with a dynamic ID if needed
                        product_id: product.product_id,
                        quantity: newQuantity
                    },
                    {
                        onConflict: ['cart_id', 'product_id'], // Specify the unique constraint columns
                    }
                );   
                if (error) {
                    console.error("Loi delete");
                } else {
                    if (newQuantity === 0) {
                        const newProducts = [...products];
                        const productIndex = newProducts.findIndex(
                            (p) => p.id === product.id
                        );
                        if (productIndex >= 0) {
                            newProducts.splice(productIndex, 1);
                        }
                        setProducts(newProducts);
                    }
                    setQuantity(newQuantity);
                }
            }
        }
        else {
            console.error("Loi xyz");
        }
    };

    return (
        <><div>
            {products.map((product) => (
                <div className="cart-item" key={product.id}>
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="cart-item-image" />
                    <div className="cart-item-info">
                        <h3>{product.name}</h3>
                        <p>Giá: {product.sell_price}</p>
                        <p>Số lượng: {product.stock_quantity}</p>
                    </div>
                    <div className="cart-item-actions">
                        <button
                            onClick={() => handleAddToCart(product)}
                        >
                            +
                        </button>
                        <button
                            onClick={() => handleRemoveFromCart(product)}
                        >
                            -
                        </button>
                    </div>
                </div>
            ))}
        </div><div></div></>
    );
};



export default CartDetail;

