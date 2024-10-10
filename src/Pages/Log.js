import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, message, Layout } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { supabase } from '../supabaseClient';
import './CSS/Log.css';

const { Title } = Typography;

const Auth = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [form] = Form.useForm();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is already logged in from localStorage
    const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedInStatus);
  }, []);

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
        // const token = jwt.sign({ userId: user.id, role: user.role }, process.env.SECRET_KEY, {
        //   expiresIn: '1h', // token expires in 1 hour
        // });
      
      // Set the logged-in status to true
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');  // Store the logged-in status in localStorage

      document.cookie = `user_id=${user.id}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/; samesite=strict; secure`;
      document.cookie = `user_name=${user.user_name}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/; samesite=strict; secure`;
      document.cookie = `role_id=${user.role_id}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/; samesite=strict; secure`;

      const { data: tokenData, error: tokenError } = await supabase.auth.getSession();

      if (tokenError) {
        message.error(`Error getting token: ${tokenError.message}`);
      } else {
        localStorage.setItem('token', tokenData.access_token);
      }

      localStorage.setItem('user', JSON.stringify(data[0]));

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
  <Layout className="auth-container" >
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
  </Layout>
);
};

export default Auth;

