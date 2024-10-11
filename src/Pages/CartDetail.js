import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Layout, Menu, List, Card, Button, InputNumber, Typography, Badge, Avatar } from 'antd';
import { ShoppingCartOutlined, DeleteOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons';
import "./CSS/CartDetail.css";
import  Header  from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";

const { Content } = Layout;
const { Title, Text } = Typography;

const CartDetail = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserAndCart = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                if (userInfo) {
                    setUser(userInfo);
                    await fetchCartItems(userInfo.id);
                }
            } catch (error) {
                alert("Error fetching user info: " + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserAndCart();
    }, []);

    const fetchCartItems = async (userId) => {
        try {
            // Đầu tiên, lấy cart_id của người dùng
            const { data: cartData, error: cartError } = await supabase
                .from("cart")
                .select("id")
                .eq('user_id', userId)
                .single();

            if (cartError) throw cartError;

            // Sau đó, lấy các items trong cart
            const { data: itemsData, error: itemsError } = await supabase
                .from("cart_item")
                .select(`
                    cart_id,
                    quantity,
                    products (
                        product_id,
                        name,
                        sell_price,
                        img
                    )
                `)
                .eq('cart_id', cartData.id);

            if (itemsError) throw itemsError;
            setCartItems(itemsData);
        } catch (error) {
            alert("Error fetching cart items: " + error.message);
        }
    };

    const updateQuantity = async (cartItemId, newQuantity) => {
        try {
            const { data, error } = await supabase
                .from("cart_item")
                .update({ quantity: newQuantity })
                .eq('cart_id', cartItemId)
                .eq('product_id', cartItemId.product_id);

            if (error) throw error;
            await fetchCartItems(user.id); // Refresh cart items
        } catch (error) {
            alert("Error updating cart: " + error.message);
        }
    };

    const removeProduct = async (cartItemId, productId) => {
        try {
            const { error } = await supabase
                .from("cart_item")
                .delete()
                .eq('cart_id', cartItemId)
                .eq('product_id', productId);

            if (error) throw error;
            await fetchCartItems(user.id); // Refresh cart items
        } catch (error) {
            alert("Error removing product from cart: " + error.message);
        }
    };

    const total = cartItems.reduce((sum, item) => sum + item.products.sell_price * item.quantity, 0);
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <Layout className="layout" style={{ minHeight: "100vh" }}>
            <Header/>
            <Content style={{ padding: '0 50px', marginTop: 64 }}>
                <div className="site-layout-content" style={{ background: '#fff', padding: 24, minHeight: 380 }}>
                    <Title level={2}>{user ? `${user.name}'s Shopping Cart` : 'Your Shopping Cart'}</Title>
                    <List
                        itemLayout="horizontal"
                        dataSource={cartItems}
                        loading={loading}
                        renderItem={item => (
                            <List.Item
                                actions={[
                                    <Button 
                                        icon={<DeleteOutlined />} 
                                        onClick={() => removeProduct(item.cart_id, item.products.product_id)}
                                        danger
                                    />
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={item.products.img} shape="square" size={64} />}
                                    title={item.products.name}
                                    description={`Price: $${item.products.sell_price.toFixed(2)}`}
                                />
                                <div>
                                    <InputNumber 
                                        min={1} 
                                        value={item.quantity} 
                                        onChange={(value) => updateQuantity(item.cart_id, value)}
                                    />
                                </div>
                            </List.Item>
                        )}
                    />
                    <Card style={{ marginTop: 16 }}>
                        <Text strong>Subtotal ({itemCount} items): ${total.toFixed(2)}</Text>
                        <Button type="primary" size="large" style={{ width: '100%', marginTop: 16 }}>
                            Proceed to Checkout
                        </Button>
                    </Card>
                </div>
            </Content>
            <Footer/>
        </Layout>
    );
};

export default CartDetail;