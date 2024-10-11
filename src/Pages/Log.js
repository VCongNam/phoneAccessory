import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { supabase } from '../supabaseClient';
import {encoder64} from '../Components/Base64Encoder/Base64Encoder';
import './CSS/Log.css';

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

      if (data.length > 0) {
        message.success('Đăng nhập thành công');
        const user = data[0];
        const tokenData = { userId: user.user_id, roleId: user.role_id };

        // Set the user cookie
        document.cookie = `token=${JSON.stringify(encoder64(tokenData))}; expires=${new Date(
          new Date().getTime() + 60 * 60 * 1000 // 1 hour expiry
        ).toUTCString()}; path=/; samesite=strict; secure`;

        // Set the logged-in status to true
        localStorage.setItem('isLoggedIn', 'true'); // Store the logged-in status in localStorage

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
          rules={[{ required: true, message: 'Hãy nhập mật khẩu!' }]}
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
  );
};

export default Auth;
