import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, message, Layout } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { supabase } from '../supabaseClient';
import { encoder64 } from '../Components/Base64Encoder/Base64Encoder';
import './CSS/AdminAuth.css';

const { Title } = Typography;

const SellerAuth = () => {
    const [isLogin, setIsLoggedIn] = useState(true);
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        const { phone, password } = values;
        const { data, error: fetchError } = await supabase
            .from('account')
            .select('*')
            .eq('user_name', phone)
            .eq('password', password);

        if (fetchError) {
            message.error('Lỗi khi truy vấn cơ sở dữ liệu: ' + fetchError.message);
            return;
        }

        if (data.length === 0) {
            message.error('Không tìm thấy tài khoản với thông tin đăng nhập này!');
            return;
        }


        if (data.length > 0 && data[0].role_id === 3) {
            message.success('Đăng nhập thành công');
            setIsLoggedIn(true);

            const user = data[0];
            const tokenData = { user_id: user.user_id, role_id: user.role_id };

            const encodedToken = encoder64(JSON.stringify(tokenData));
            // Set the user cookie
            document.cookie = `token=${encodedToken}; expires=${new Date(
                new Date().getTime() + 60 * 60 * 1000 // 1 hour expiry
            ).toUTCString()}; path=/; samesite=strict; secure`;

            window.location.href = '/SellerDashboard';
        } else {
            message.error('Đăng nhập bằng tài khoản không hợp lệ!');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <Title level={2} className="auth-title">Đăng nhập</Title>
                <Form
                    form={form}
                    name="auth-form"
                    onFinish={handleSubmit}
                    layout="vertical"
                    className="auth-form"
                >
                    <Form.Item
                        name="phone"
                        rules={[
                            { required: true, message: 'Nhập số điện thoại của bạn!' },
                            { pattern: /^0[0-9]{9}$/, message: 'Hãy nhập số điện thoại hợp lệ!' },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined className="auth-icon" />}
                            placeholder="Số điện thoại"
                            className="auth-input"
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Hãy nhập mật khẩu!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="auth-icon" />}
                            placeholder="Mật khẩu"
                            className="auth-input"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="auth-button">
                            Đăng nhập
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default SellerAuth;
