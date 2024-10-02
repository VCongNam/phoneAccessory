
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Layout, Menu, List, Card, Button, InputNumber, Typography, Badge, Avatar } from 'antd';
import { ShoppingCartOutlined, DeleteOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons';
import "./CSS/CartDetail.css";

const { Content } = Layout;
const { Title, Text } = Typography;

const CartDetail = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch all products
                const { data, error } = await supabase
                    .from("products")
                    .select("*");

                if (error) {
                    alert("Error fetching products: " + error.message);
                } else {
                    setProducts(data.map(product => ({
                        ...product,
                        quantity: 1 // default quantity
                    })));
                }
            } catch (error) {
                alert("Unexpected error fetching products: " + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const updateQuantity = async (productId, newQuantity) => {
        const newProducts = products.map(product =>
            product.id === productId ? { ...product, quantity: newQuantity } : product
        );
        setProducts(newProducts);
    };

    const removeProduct = async (productId) => {
        const newProducts = products.filter(product => product.id !== productId);
        setProducts(newProducts);
    };

    const total = products.reduce((sum, product) => sum + product.sell_price * product.quantity, 0);
    const itemCount = products.reduce((sum, product) => sum + product.quantity, 0);

    return (
        <Layout className="layout">
            <Content style={{ padding: '0 50px', marginTop: 64 }}>
                <div className="site-layout-content" style={{ background: '#fff', padding: 24, minHeight: 380 }}>
                    <Title level={2}>Your Shopping Cart</Title>
                    <List
                        itemLayout="horizontal"
                        dataSource={products}
                        loading={loading}
                        renderItem={product => (
                            <List.Item
                                actions={[
                                    <Button 
                                        icon={<DeleteOutlined />} 
                                        onClick={() => removeProduct(product.id)}
                                        danger
                                    />
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={product.imageUrl} shape="square" size={64} />}
                                    title={product.name}
                                    description={`Price: $${product.sell_price.toFixed(2)}`}
                                />
                                <div>
                                    <InputNumber 
                                        min={1} 
                                        value={product.quantity} 
                                        onChange={(value) => updateQuantity(product.id, value)}
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
        </Layout>
    );
};

export default CartDetail;
