import { useState, useEffect } from "react";
import { Layout, Menu, Dropdown, Button, Avatar, Space } from "antd";
import { UserOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import "./Header.css";

const { Header } = Layout;

function AppHeader() {
  // Quản lý trạng thái đăng nhập
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Giả lập việc lấy trạng thái đăng nhập từ localStorage hoặc API
  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedInStatus);
  }, []);

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem("isLoggedIn", "false"); // Giả lập việc lưu trạng thái vào localStorage
  };

  // Hàm xử lý đăng nhập (giả lập, trong thực tế bạn sẽ cần thực hiện qua API)
  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  // Menu dành cho người dùng đã đăng nhập
  const userMenu = (
    <Menu>
      <Menu.Item key="profile">
        <a href="#profile">Thông tin cá nhân</a>
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  // Menu dành cho người chưa đăng nhập
  const guestMenu = (
    <Menu>
      <Menu.Item key="login" onClick={handleLogin}>
        Đăng nhập
      </Menu.Item>
      <Menu.Item key="signup">
        <a href="#signup">Đăng kí</a>
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout>
      <Header className="header-custom">
        <div className="logo">Shop phụ kiện VIP</div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['home']}
          className="menu-custom"
        >
          <Menu.Item key="home">
            <a href="#home">Sản Phẩm</a>
          </Menu.Item>
          <Menu.Item key="cart" icon={<ShoppingCartOutlined />}>
            Giỏ hàng
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
  );
}

export default AppHeader;
