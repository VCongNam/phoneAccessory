import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, message, Layout } from 'antd';
import { UserOutlined, LockOutlined, KeyOutlined } from '@ant-design/icons';
import { supabase } from '../supabaseClient';
import { encoder64 } from '../Components/Base64Encoder/Base64Encoder';
import './CSS/AdminAuth.css';

const { Title } = Typography;

const STATIC_SECRET_KEY = "a1b2c3d4e5f6";

const AdminAuth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        const { phone, password } = values;
        const { data, error: fetchError } = await supabase
            .from('account')
            .select('*')
            .eq('user_name', phone)
            .eq('password', password);

        if (fetchError) {
            message.error(`Lỗi truy vấn cơ sở dữ liệu: ${fetchError.message}`);
            return;
        }

        // Check xem user có đúng là admin hay k
        if (data.length > 0 && data[0].role_id === 2) {
            message.success('Đăng nhập thành công');
            setIsLogin(true);

            const user = data[0];
            const tokenData = { user_id: user.user_id, role_id: user.role_id };

            const encodedToken = encoder64(JSON.stringify(tokenData));
            // Tạo cookie
            document.cookie = `token=${encodedToken}; expires=${new Date(
                new Date().getTime() + 60 * 60 * 1000 // Hết trong 1 giờ
            ).toUTCString()}; path=/; samesite=strict; secure`;

            window.location.href = '/dashboard';
        } else {
            message.error('Đăng nhập bằng tài khoản không hợp lệ!');
        }
    };

    const handleChangePasswordSubmit = async (values) => {
        const { secretKey, newPassword, confirmNewPassword } = values;
        if (newPassword !== confirmNewPassword) {
            message.error('Mật khẩu mới và mật khẩu xác nhận không khớp!');
            return;
        }

        if (secretKey === STATIC_SECRET_KEY) {
            const { error: updateError } = await supabase
                .from('account')
                .update({ password: newPassword })
                .eq('role_id', 2); // Chỉ đổi mật khẩu cho admin

            if (updateError) {
                message.error(`Lỗi khi đổi mật khẩu! ${updateError.message}`);
            } else {
                message.success('Đổi mật khẩu thành công!');
                setIsLogin(true);
            }
        } else {
            message.error('Mã admin không hợp lệ!');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <Title level={2} className="auth-title">
                    {isLogin ? 'Đăng nhập' : 'Đổi mật khẩu'}
                </Title>
                <Form
                    form={form}
                    name={isLogin ? 'auth-form' : 'change-password-form'}
                    onFinish={isLogin ? handleSubmit : handleChangePasswordSubmit}
                    layout="vertical"
                    className="auth-form"
                >
                    {isLogin ? (
                        <>
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
                                rules=
                                {[{ required: true, message: 'Hãy nhập mật khẩu!' },
                                {
                                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                    message: 'Hãy điền tối thiểu 8 ký tự bao gồm tối thiểu 1 chữ cái thường, chữ cái in hoa, số và kí tự đặc biệt'
                                }
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined className="auth-icon" />}
                                    placeholder="Mật khẩu"
                                    className="auth-input"
                                />
                            </Form.Item>
                        </>
                    ) : (
                        <>
                            <Form.Item
                                name="secretKey"
                                rules={[{ required: true, message: 'Hãy nhập mã Admin!' }]}
                            >
                                <Input
                                    prefix={<KeyOutlined className="auth-icon" />}
                                    placeholder="Mã Admin"
                                    className="auth-input"
                                />
                            </Form.Item>
                            <Form.Item
                                name="newPassword"
                                rules={[
                                    { required: true, message: 'Hãy nhập mật khẩu mới!' },
                                    {
                                        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                        message: 'Hãy điền tối thiểu 8 ký tự bao gồm tối thiểu 1 chữ cái thường, chữ cái in hoa, số và kí tự đặc biệt'                                    }
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined className="auth-icon" />}
                                    placeholder="Mật khẩu mới"
                                    className="auth-input"
                                />
                            </Form.Item>
                            <Form.Item
                                name="confirmNewPassword"
                                rules={[
                                    { required: true, message: 'Hãy xác nhận mật khẩu mới!' },
                                    {
                                        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                        message: 'Hãy điền tối thiểu 8 ký tự bao gồm tối thiểu 1 chữ cái thường, chữ cái in hoa, số và kí tự đặc biệt'                                    }
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined className="auth-icon" />}
                                    placeholder="Xác nhận mật khẩu mới"
                                    className="auth-input"
                                />
                            </Form.Item>
                        </>
                    )}
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="auth-button">
                            {isLogin ? 'Đăng nhập' : 'Đổi mật khẩu'}
                        </Button>
                        <Button
                            type="link"
                            onClick={() => {
                                setIsLogin(!isLogin);
                                form.resetFields();
                            }}
                        >
                            {isLogin ? 'Đổi mật khẩu?' : 'Quay lại đăng nhập'}
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default AdminAuth;
