import { useState, useEffect } from "react";
import { Layout, Menu, Dropdown, Avatar, Space } from "antd";
import { UserOutlined, ShoppingCartOutlined, LoginOutlined } from "@ant-design/icons";
import "./Header.css";
import logow from "./logow.jpg";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

const { Header } = Layout;
const { SubMenu } = Menu;

function AppHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [categories, setCategories] = useState([]); // State to store categories

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*');

      if (error) {
        console.error("Error fetching categories:", error);
      } else {
        setCategories(data);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedInStatus);
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem("isLoggedIn", "false");
    document.cookie = 'user_id=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; samesite=strict; secure';
    document.cookie = 'user_name=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; samesite=strict; secure';
    document.cookie = 'role_id=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; samesite=strict; secure';
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; samesite=strict; secure';
    window.location.href = '/';
  };

  const handleLogin = () => {};

  const userMenu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/profile">Thông tin cá nhân</Link>
      </Menu.Item>
      <Menu.Divider />
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
      <Menu.Divider />
    </Menu>
  );

  return (
    <Header className="header-custom">
      <div className="header-content">
        <div className="logo">
          <Link to="/">
            <img src={logow} alt="Logo" className="logo-image" style={{ width: "100px", height: "100px" }} />
          </Link>
        </div>
        
        <div className="blank-space" />

        <div className="right-menu">
          <Menu mode="horizontal" className="menu-custom">
            {/* SubMenu for Product Categories from Supabase */}
            <Menu.Item key="products">
              
            
            <SubMenu
              key="products"
              title={<Link to="/productlist">Sản Phẩm</Link>} // Custom CSS class for "Sản Phẩm"
            >
              {categories.map((category) => (
                <Menu.Item key={category.id} className="menu-item-custom">
                  <Link to={`/productlist/${category.id}`}>{category.name}</Link>
                </Menu.Item>
              ))}
            </SubMenu>
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
