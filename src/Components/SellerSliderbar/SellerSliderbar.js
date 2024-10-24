import React from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  ShoppingOutlined,

} from '@ant-design/icons';

const { Sider } = Layout;

const SellerSidebar = ({ onMenuClick }) => {

  return (
    <Sider
      width={300}
      className="site-layout-background" 
      breakpoint="lg" 
    >
      <Menu
        mode="inline"
        defaultSelectedKeys={['dashboard']}
        style={{ height: '100%', borderRight: 0 }}
        onClick={({ key }) => onMenuClick(key)}
      >
        <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
          Tổng quan
        </Menu.Item>
        <Menu.Item key="products" icon={<ShoppingOutlined />}>
          Quản lý sản phẩm
        </Menu.Item>

      </Menu>
    </Sider>
  );
};

export default SellerSidebar;
