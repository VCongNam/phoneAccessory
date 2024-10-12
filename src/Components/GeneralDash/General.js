import React, { useState, useEffect } from "react";
import { Row, Col, Card, Statistic, Table, Layout, Breadcrumb } from "antd";
import { ShoppingCartOutlined, UserOutlined, DollarOutlined, StockOutlined } from "@ant-design/icons";
import "./DashboardOverview.css";  // Optional CSS for custom styling

const { Content } = Layout;

const DashboardOverview = () => {
  const [statistics, setStatistics] = useState({
    totalOrders: 0,
    totalCustomers: 0,
    totalSales: 0,
    lowStockProducts: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    // Simulating data fetching, replace with your API call
    setStatistics({
      totalOrders: 100,
      totalCustomers: 50,
      totalSales: 5000000,
      lowStockProducts: 5,
    });

    setRecentOrders([
      { id: 1, customer: "Nguyễn Văn A", total: 1000000, date: "2024-10-01", status: "Đã giao" },
      { id: 2, customer: "Trần Thị B", total: 500000, date: "2024-10-02", status: "Đang xử lý" },
      { id: 3, customer: "Lê Văn C", total: 750000, date: "2024-10-03", status: "Đang xử lý" },
    ]);
  }, []);

  const orderColumns = [
    { title: "ID Đơn hàng", dataIndex: "id", key: "id" },
    { title: "Khách hàng", dataIndex: "customer", key: "customer" },
    { title: "Tổng tiền", dataIndex: "total", key: "total", render: (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value) },
    { title: "Ngày đặt", dataIndex: "date", key: "date" },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
  ];

  return (
    <Layout style={{ padding: "0 24px 24px" }}>
      
      <Content>
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Tổng đơn hàng"
                value={statistics.totalOrders}
                prefix={<ShoppingCartOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Tổng khách hàng"
                value={statistics.totalCustomers}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Tổng doanh thu"
                value={statistics.totalSales}
                prefix={<DollarOutlined />}
                formatter={value => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Sản phẩm sắp hết hàng"
                value={statistics.lowStockProducts}
                prefix={<StockOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginTop: 20 }}>
          <Col span={24}>
            <Card title="Đơn hàng gần đây">
              <Table
                columns={orderColumns}
                dataSource={recentOrders}
                pagination={false}
                rowKey="id"
              />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default DashboardOverview;
