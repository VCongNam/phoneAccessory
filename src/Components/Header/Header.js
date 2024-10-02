import { useState, useEffect } from "react";
import { Layout, Menu, Dropdown, Avatar, Space } from "antd";
import { UserOutlined, ShoppingCartOutlined } from "@ant-design/icons";
<<<<<<< HEAD
import "./Header.css"; 
=======
import { Link } from 'react-router-dom'; // Import Link for routing
import "./Header.css";
>>>>>>> 6fd3d258e7cf4a8f6fcee42f14f9a9b45587bd57


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
        <Link to="/login" >Đăng nhập</Link> 
      </Menu.Item>
      <Menu.Divider /> {/* Added divider */}
      <Menu.Item key="signup">
        <a href="#signup">Đăng kí</a>
      </Menu.Item>
    </Menu>
  );

  return (
<<<<<<< HEAD
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
          <a href="#home">Sản Phẩm</a>
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
=======
    <Layout>
      <Header className="header-custom">
      <div className="logo">
          {/* Make the logo clickable using Link */}
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '20px' }}>
            Shop phụ kiện VIP
          </Link>
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['home']}
          className="menu-custom"
        >
         <Menu.Item key="home">
            <Link to="/productlist">Sản Phẩm</Link> {/* Use Link to route to the Product List page */}
          </Menu.Item>
          <Menu.Item key="cart" icon={<ShoppingCartOutlined />}>
           <Link to="/cart">Giỏ hàng</Link> 
          </Menu.Item>

          {/* Kiểm tra trạng thái đăng nhập */}
          <Menu.Item key="account" style={{ marginLeft: 'auto' }}>
            {isLoggedIn ? (
              <Dropdown overlay={userMenu} placement="bottomRight">
                <Space>
                  <Avatar icon={<UserOutlined />} />
                  Profile
                </Space>
              </Dropdown>
            ) : (
              <Dropdown overlay={guestMenu} placement="bottomRight">
                <Space>
                  <Avatar icon={<UserOutlined />} />
                  Tài Khoản
                </Space>
              </Dropdown>
            )}
          </Menu.Item>
        </Menu>
      </Header>
    </Layout>
>>>>>>> 6fd3d258e7cf4a8f6fcee42f14f9a9b45587bd57
  );
}

export default AppHeader;