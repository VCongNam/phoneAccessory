import { useState, useEffect } from "react";
import { Layout, Menu, Dropdown, Avatar, Space } from "antd";
import { UserOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import "./Header.css"; 
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

    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

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
        <a href="#profile">Thông tin cá nhân</a>
      </Menu.Item>
      <Menu.Divider /> {/* Added divider for better visual separation */}
      <Menu.Item key="logout" onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  const guestMenu = (
    <Menu>
      <Menu.Item key="login" onClick={handleLogin}>
       <Link to="/login">Đăng nhập</Link>
      </Menu.Item>
      <Menu.Divider /> {/* Added divider */}
      <Menu.Item key="signup">
        <a href="#signup">Đăng kí</a>
      </Menu.Item>
    </Menu>
  );

  return (
    <Header className="header-custom"> 
      <div className="logo"> 
        {/* Improved logo styling */}
        <a href="#home"> 
          <span className="logo-text">Gadget Galaxy</span>
        </a>
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["home"]}
        className="menu-custom"
      >
        <Menu.Item key="home">
          <Link to={"/productlist"}>Sản Phẩm</Link>
        </Menu.Item>
        <Menu.Item key="cart" icon={<ShoppingCartOutlined />}>
          Giỏ hàng
        </Menu.Item>
        <Menu.Item key="account" style={{ marginLeft: "auto" }}>
          <Dropdown overlay={isLoggedIn ? userMenu : guestMenu} placement="bottomRight">
            <a onClick={(e) => e.preventDefault()}> {/* Prevent default link behavior */}
              <Space>
                <Avatar icon={<UserOutlined />} />
                {isLoggedIn ? "Profile" : "Tài Khoản"}
              </Space>
            </a>
          </Dropdown>
        </Menu.Item>
      </Menu>
    </Header>
  );
}

export default AppHeader;
