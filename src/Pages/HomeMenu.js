import React, { useEffect, useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { supabase } from '../supabaseClient'; // Import Supabase client
import './CSS/HomeMenu.css'; // Tạo file CSS riêng để tùy chỉnh
import bn1 from './images/bn1.jpg';
import opip15 from './images/opip15.jpg';

// Map danh mục với URL ảnh tương ứng
const categoryCodeMap = {
  'Ốp lưng': bn1,
  'Củ sạc': opip15,
  'Cáp sạc': 'https://example.com/images/capsac.png',
  'Tai nghe': 'https://example.com/images/tainghe.png',
  'Sạc dự phòng pin': 'https://example.com/images/sacdp.png',
  'Giá đỡ điện thoại': 'https://example.com/images/giado.png',
  'Loa bluetooth': 'https://example.com/images/loabluetooth.png',
  // Thêm các thể loại khác tại đây
};

// Hàm lấy URL hình ảnh từ tên danh mục
const getCategoryImage = (categoryName) => {
  return categoryCodeMap[categoryName] || null;
};

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
        {categories.map((category) => {
          const imageUrl = category.image_url || getCategoryImage(category.name);
          return (
            <Col key={category.id} xs={6} md={4} lg={2} className="mb-4">
              <Card className="text-center product-card">
                {imageUrl ? (
                  <Card.Img
                    variant="top"
                    src={imageUrl}
                    alt={category.name}
                    className="product-image"
                  />
                ) : (
                  <div className="category-icon">
                    <span className="icon-code">
                      {category.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
                <Card.Body>
                  <Card.Title>{category.name}</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default HomeMenu;
