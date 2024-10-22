import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Layout, Menu, List, Card, Button, InputNumber, Typography, Badge, Avatar, Popconfirm } from 'antd';
import { ShoppingCartOutlined, DeleteOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons';
import "./CSS/CartDetail.css";
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import { decoder64 } from '../Components/Base64Encoder/Base64Encoder';


const { Content } = Layout;
const { Title, Text } = Typography;
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};
const CartDetail = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserAndCart = async () => {
            try {
                const userInfoCookie = getCookie('token');
                if (userInfoCookie) {
                    const decodedUserInfo = JSON.parse(decoder64(userInfoCookie));
                    setUser(decodedUserInfo); // Cập nhật state user
                }
            } catch (error) {
                console.error("Lỗi lấy thông tin người dùng:", error);
                alert("Lỗi lấy thông tin người dùng: " + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserAndCart();
    }, []);
    useEffect(() => {
        // useEffect này sẽ chạy mỗi khi user thay đổi
        const fetchCart = async () => {
            if (user) { // Kiểm tra user đã có giá trị chưa
                try {
                    await fetchCartItems(user.user_id);
                } catch (error) {
                    console.error("Lỗi lấy sản phẩm trong giỏ hàng:", error);
                    alert("Lỗi lấy sản phẩm trong giỏ hàng: " + error.message);
                }
            }
        };

        fetchCart();
    }, [user]);
    const fetchCartItems = async (user_id) => {
        try {
            const { data: cartData, error: cartError } = await supabase
                .from("cart")
                .select("id")
                .eq('user_id', user_id)
                .single();

            if (cartError) throw cartError;

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
            alert("Lỗi lấy sản phẩm trong giỏ hàng: " + error.message);
        }
    };

    const updateQuantity = async (cart_item, quantity) => {
        try {
            const { data, error } = await supabase
                .from("cart_item")
                .update({ quantity: quantity })
                .eq('cart_id', cart_item.cart_id)
                .eq('product_id', cart_item.products.product_id);
            console.log(cart_item);
            console.log(cart_item.products.product_id);

            if (error) throw error;
            await fetchCartItems(user.user_id);
        } catch (error) {
            alert("Lỗi khi cập nhật số lượng: " + error.message);
        }
    };

    const removeProduct = async (cart_id, product_id) => {
        try {
            const { error } = await supabase
                .from("cart_item")
                .delete()
                .eq('cart_id', cart_id)
                .eq('product_id', product_id);

            if (error) throw error;
            await fetchCartItems(user.user_id);
        } catch (error) {
            alert("Lỗi khi xóa sản phẩm: " + error.message);
        }
    };

    const total = cartItems.reduce((sum, item) => sum + item.products.sell_price * item.quantity, 0);
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <Layout className="layout" style={{ minHeight: "100vh" }}>
            <Header />
            <Content style={{ padding: '0 50px', marginTop: 64 }}>
                <div className="site-layout-content" style={{ background: '#fff', padding: 24, minHeight: 380 }}>
                    <List
                        itemLayout="horizontal"
                        dataSource={cartItems.sort((a, b) => a.products.product_id - b.products.product_id)} // sap xep cart_item theo product_id
                        loading={loading}
                        renderItem={item => (
                            <List.Item
                                actions={[

                                    <Popconfirm
                                        title="Bạn có chắc muốn xóa sản phẩm này"
                                        onConfirm={() => removeProduct(item.cart_id, item.products.product_id)}
                                        okText="Có"
                                        cancelText="Không"
                                    >
                                        <Button
                                            icon={<DeleteOutlined />}
                                            danger
                                        />
                                    </Popconfirm>
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={item.products.img} shape="square" size={64} />}
                                    title={item.products.name}
                                    description={`Giá: ${item.products.sell_price.toLocaleString('vi-VN')} VND`}
                                />
                                <div>
                                    <InputNumber
                                        min={1}
                                        value={item.quantity}
                                        onChange={(value) => updateQuantity(item, value)}
                                    />
                                </div>
                            </List.Item>
                        )}
                    />
                    <Card style={{ marginTop: 16 }}>
                        <Text strong>Tổng giá trị ({itemCount} items): {total.toLocaleString('vi-VN')} VND</Text>
                        <Button type="primary" size="large" style={{ width: '100%', marginTop: 16 }}>
                            Tiếp tục thanh toán
                        </Button>
                    </Card>
                </div>
            </Content>
            <Footer />
        </Layout>
    );
};

export default CartDetail;

