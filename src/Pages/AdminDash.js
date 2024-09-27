import React, { useState } from 'react';
import { Layout } from 'antd';
import HeaderDash from '../Components/HeaderDash/HeaderDash';
import Sidebar from '../Components/Sidebar/Sidebar';
import OrderManagement from '../Components/OrderManagement/OrderManagement';
import ProductManagement from '../Components/ProductManagement/ProductManagement';
import UserManagement from '../Components/UserManagement/UserManagement';
import AccountManagement from '../Components/UserManagement/UserManagement';
import ReportAndStatistics from '../Components/Report/ReportAndStatistics';

const { Content } = Layout;

const DashboardPage = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <div>Dashboard/Tổng quan</div>;
      case 'products':
        return <ProductManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'customers':
        return <UserManagement />;
      case 'accounts':
        return <AccountManagement />;
      case 'reports':
        return <ReportAndStatistics />;
      default:
        return <div>Dashboard/Tổng quan</div>;
    }
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <HeaderDash /> {/* Thêm Header vào đây */}
      <Layout>
        <Sidebar onMenuClick={setCurrentPage} />
        <Layout style={{ padding: '24px' }}>
          <Content style={{ padding: '24px', backgroundColor: '#fff' }}>
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default DashboardPage;
