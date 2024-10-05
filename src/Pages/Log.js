import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { supabase } from '../supabaseClient';
import './CSS/Log.css';

const { Title } = Typography;

const Auth = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    const { phone, password, confirmPassword } = values;

    if (isRegister) {
      if (password !== confirmPassword) {
        message.error('Passwords do not match');
        return;
      }

      const { error: insertError } = await supabase.from('account').insert([
        {
          user_name: phone,
          password: password,
          role_id: 1, // Default role (as 'User')
        },
      ]);

      if (insertError) {
        message.error(`Error inserting into account table: ${insertError.message}`);
      } else {
        message.success('User registered successfully');
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
        message.success('Login successful');
        const user = data[0];
        document.cookie = `user_id=${user.id}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/; samesite=strict; secure`;
        document.cookie = `user_name=${user.user_name}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/; samesite=strict; secure`;
        document.cookie = `role_id=${user.role_id}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/; samesite=strict; secure`;

        localStorage.setItem('user', JSON.stringify(data[0]));

        if (user.role_id === 2) {
          window.location.href = '/dashboard';
        } else {
          window.location.href = '/';
        }
      } else {
        message.error('Invalid phone number or password');
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
            { required: true, message: 'Please input your phone number!' },
            { pattern: /^0[0-9]{9}$/, message: 'Please enter a valid phone number!' },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Số điện thoại" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
        </Form.Item>
        {isRegister && (
          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
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