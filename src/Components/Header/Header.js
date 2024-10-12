import { useState, useEffect } from "react";
import { Layout, Menu, Dropdown, Avatar, Space } from "antd";
import { UserOutlined, ShoppingCartOutlined, LoginOutlined, UserAddOutlined } from "@ant-design/icons"; // Add icons for login/signup
import "./Header.css";
import logow from "./logow.jpg"

import { Link } from "react-router-dom";
const { Header } = Layout;

function AppHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedInStatus);
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem("isLoggedIn", "false");

    // Clear cookies by setting them to expire in the past
    document.cookie = 'user_id=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; samesite=strict; secure';
    document.cookie = 'user_name=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; samesite=strict; secure';
    document.cookie = 'role_id=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; samesite=strict; secure';
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; samesite=strict; secure';

    // Clear localStorage
    // localStorage.removeItem('token');
    // localStorage.removeItem('user');

    // Redirect to the login page
    window.location.href = '/';
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/profile">Thông tin cá nhân</Link>
      </Menu.Item>
      <Menu.Divider /> {/* Added divider for better visual separation */}
      <Menu.Item key="logout" onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  const guestMenu = (
    <Menu>
      <Menu.Item key="login" onClick={handleLogin} icon={<LoginOutlined />}>
        <Link to="/login">Đăng nhập</Link>
      </Menu.Item>
      <Menu.Divider /> {/* Added divider */}
      <Menu.Item key="signup">
        <Link to={"/signup"}>Đăng kí</Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <Header className="header-custom">
      <div className="header-content">
        <div className="logo">
          {/* Logo */}
      
          <Link to="/">
            <img src={logow} alt="Logo" className="logo-image" style={{ width: "100px", height: "100px" }} />
          </Link>
        </div>
        <div className="blank-space" /> {/* Phần trắng trống */}

        {/* Các mục bắt đầu từ bên phải */}
        <div className="right-menu">
          <Menu mode="horizontal" className="menu-custom">
            <Menu.Item key="home">
              <Link to="/productlist">Sản Phẩm</Link>
            </Menu.Item>

            <Menu.Item key="cart" icon={<ShoppingCartOutlined />}>
              <Link to="/cart">Giỏ hàng</Link>
            </Menu.Item>
            

            <Menu.Item key="account">
              <Dropdown overlay={isLoggedIn ? userMenu : guestMenu} placement="bottomRight">
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    <Avatar icon={<UserOutlined />} />
                    {isLoggedIn ? "Hồ sơ" : "Tài Khoản"}
                  </Space>
                </a>
              </Dropdown>
            </Menu.Item>
          </Menu>
        </div>
      </div>
    </Header>
  );
}

export default AppHeader;
