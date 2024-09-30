import React from 'react';
import { Layout, Row, Col, Space, Typography } from 'antd';
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
} from '@ant-design/icons';
import './Footer.css'; // Import CSS tùy chỉnh nếu cần

const { Footer } = Layout;
const { Title, Text } = Typography;

const AppFooter = () => {
  return (
    <Layout>
      <Footer style={{ backgroundColor: '#001529', color: 'white', padding: '40px 50px' }}>
        <Row gutter={[16, 16]}>
          {/* Cột Thông tin công ty */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: 'white' }}>About Us</Title>
            <Text style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
              We are a leading company providing the best solutions for your business.
            </Text>
          </Col>

          {/* Cột Điều hướng */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: 'white' }}>Quick Links</Title>
            <Space direction="vertical">
              <a href="/about" style={{ color: 'rgba(255, 255, 255, 0.65)' }}>About</a>
              <a href="/services" style={{ color: 'rgba(255, 255, 255, 0.65)' }}>Services</a>
              <a href="/contact" style={{ color: 'rgba(255, 255, 255, 0.65)' }}>Contact Us</a>
              <a href="/faq" style={{ color: 'rgba(255, 255, 255, 0.65)' }}>FAQ</a>
            </Space>
          </Col>

          {/* Cột Thông tin liên hệ */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: 'white' }}>Contact Us</Title>
            <Space direction="vertical">
              <Text style={{ color: 'rgba(255, 255, 255, 0.65)' }}>Phone: +123 456 789</Text>
              <Text style={{ color: 'rgba(255, 255, 255, 0.65)' }}>Email: info@company.com</Text>
              <Text style={{ color: 'rgba(255, 255, 255, 0.65)' }}>Address: 123 Street, City, Country</Text>
            </Space>
          </Col>

          {/* Cột Mạng xã hội */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: 'white' }}>Follow Us</Title>
            <Space size="middle">
              <a href="https://facebook.com" style={{ color: 'white' }}>
                <FacebookOutlined style={{ fontSize: '24px' }} />
              </a>
              <a href="https://twitter.com" style={{ color: 'white' }}>
                <TwitterOutlined style={{ fontSize: '24px' }} />
              </a>
              <a href="https://instagram.com" style={{ color: 'white' }}>
                <InstagramOutlined style={{ fontSize: '24px' }} />
              </a>
              <a href="https://linkedin.com" style={{ color: 'white' }}>
                <LinkedinOutlined style={{ fontSize: '24px' }} />
              </a>
            </Space>
          </Col>
        </Row>

        {/* Footer Bottom Section */}
        <Row style={{ marginTop: '40px', textAlign: 'center' }}>
          <Col span={24}>
            <Text style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
              ©2024 Your Company. All Rights Reserved. | Privacy Policy | Terms of Service
            </Text>
          </Col>
        </Row>
      </Footer>
    </Layout>
  );
};

export default AppFooter;
