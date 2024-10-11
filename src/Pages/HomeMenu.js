import React, { useEffect, useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { supabase } from '../supabaseClient'; // Import Supabase client
import './CSS/HomeMenu.css'; // Tạo file CSS riêng để tùy chỉnh

const HomeMenu = () => {
  const [categories, setCategories] = useState([]); // State để lưu trữ danh sách danh mục
  const [loading, setLoading] = useState(true); // State để lưu trạng thái tải dữ liệu

  // Hàm để lấy danh mục từ Supabase
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories') // Thay thế 'categories' bằng tên bảng của bạn
        .select('*');
      if (error) {
        console.error('Error fetching categories:', error);
      } else {
        setCategories(data); // Lưu danh mục vào state
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false); // Dừng trạng thái tải
    }
  };

  // Sử dụng useEffect để fetch danh mục khi component được render
  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Hiển thị loading nếu dữ liệu đang được tải
  }

  return (
    <div className="product-grid-container">
      <h3 className="text-center mb-4">ĐÚNG HÀNG - ĐÚNG GIÁ - ĐÚNG CHẤT LƯỢNG</h3>
      <Row>
        {categories.map((category) => (
          <Col key={category.id} xs={6} md={4} lg={2} className="mb-4">
            <Card className="text-center product-card">
              <Card.Img variant="top" src={category.image_url} alt={category.name} className="product-image" />
              <Card.Body>
                <Card.Title>{category.name}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default HomeMenu;
