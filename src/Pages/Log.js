import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, message, Layout } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { supabase } from '../supabaseClient';
import { encoder64 } from '../Components/Base64Encoder/Base64Encoder';
import './CSS/Log.css';
import AppHeader from '../Components/Header/Header';
import AppFooter from '../Components/Footer/Footer';
import { Container } from 'react-bootstrap';

const { Title } = Typography;

const Auth = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    const { phone, password, confirmPassword } = values;

    if (isRegister) {
      if (password !== confirmPassword) {
        message.error('Mật khẩu không trùng!');
        return;
      }

      const { error: insertError } = await supabase.from('account').insert([
        {
          user_name: phone,
          password: password,
          role_id: 1, // Default role (as 'User'),
        },
      ]);

      if (insertError) {
        message.error(`Error inserting into account table: ${insertError.message}`);
      } else {
        message.success('Đăng kí thành công');
        setIsRegister(false);
      }
    } else {
      const { data, error: fetchError } = await supabase
        .from('account')
        .select('*')
        .eq('user_name', phone)
        .eq('password', password);

      if (fetchError) {
        message.error(`Error fetching user: ${fetchError.message}`);
        return;
      }


      if (data.length > 0 && data[0].role_id === 1) {
        message.success('Đăng nhập thành công');
        const user = data[0];
        const tokenData = { user_id: user.user_id, role_id: user.role_id };
        const encodedToken = encoder64(JSON.stringify(tokenData));
        localStorage.setItem('isLoggedIn', 'true'); // Store the logged-in status in localStorage

        const profile = supabase
          .from('profileuser')
          .select('name, address')
          .eq('user_id', user.user_id)
          .single();

        if (profile.data && profile.data.address === '') {
          // If profile information is empty, redirect to user profile page
          window.location.href = '/profile';
        } else {
          // If profile information is not empty, redirect to homepage
          window.location.href = '/';
        }

        // Set the user cookie
        document.cookie = `token=${encodedToken}; expires=${new Date(
          new Date().getTime() + 60 * 60 * 1000 // 1 hour expiry
        ).toUTCString()}; path=/; samesite=strict; secure`;

        // Redirect based on the user role
        if (user.role_id === 2) {
          window.location.href = '/dashboard';
        } else {
          window.location.href = '/';
        }
      } else {
        message.error('Số điện thoại hoặc mật khẩu không hợp lệ!');
      }
    }
  };

  const handleToggle = () => {
    setIsRegister(!isRegister);
    form.resetFields();
  };

  return (
    <div>
      <AppHeader />
      <Container>
        <div className="auth-container">
          <Title level={2}>{isRegister ? 'Đăng kí' : 'Đăng nhập'}</Title>
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
              <Input prefix={<UserOutlined />} placeholder="Số điện thoại" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Hãy nhập mật khẩu!' },
                { pattern: /^(?=.*[A-Za-z])[A-Za-z\d@$!%*#?&]{8,}$/, message: 'Hãy điền tối thiểu 8 ký tự bao gồm chữ cái, số và kí tự đặc biệt' }
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
            </Form.Item>
            {isRegister && (
              <Form.Item
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Hãy nhập mật khẩu xác nhận!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Mật khẩu không khớp!'));
                    },
                  }),
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu" />
              </Form.Item>
            )}
            <Form.Item>
              <Button type="primary" htmlType="submit" className="auth-button">
                {isRegister ? 'Đăng kí' : 'Đăng nhập'}
              </Button>
            </Form.Item>
          </Form>
          <Button onClick={handleToggle} className="toggle-button">
            {isRegister ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng kí'}
          </Button>
        </div>
      </Container>
      <AppFooter />
    </div>
  );
};

export default Auth;
