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
            <Title level={4} style={{ color: 'white' }}>Về chúng tôi</Title>
            <Text style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
              Bán mọi thứ với giá rẻ nhất bạn tìm được.
            </Text>
          </Col>

         

          {/* Cột Thông tin liên hệ */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: 'white' }}>Liên hệ chúng tôi</Title>
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
          <Col xs={24} sm={12} md={4}>
        <Title level={4} style={{ color: 'white' }}>Bản đồ</Title>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.5062169060852!2d105.52270891138558!3d21.012421688257767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135abc60e7d3f19%3A0x2be9d7d0b5abcbf4!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBGUFQgSMOgIE7hu5lp!5e0!3m2!1svi!2s!4v1727742042184!5m2!1svi!2s" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
        
      
          frameBorder="0"
         
          allowFullScreen=""
          aria-hidden="false"
          tabIndex="0"
        ></iframe>
        
      </Col>
        </Row>

        {/* Footer Bottom Section */}
        <Row style={{ marginTop: '40px', textAlign: 'center' }}>
          <Col span={24}>
            <Text style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
              ©2024 Phụ Kiện VIP. Đã đăng ký Bản quyền. | Chính sách bảo mật | Điều khoản dịch vụ
            </Text>
          </Col>
        </Row>
      </Footer>
    </Layout>
  );
};

export default AppFooter;
