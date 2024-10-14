import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Spin } from 'antd'; // Import Ant Design components
import { supabase } from '../supabaseClient'; // Import Supabase client
import './CSS/HomeMenu.css'; // Custom CSS
import capsac from './images/capsac.png';
import cusac from './images/cusac.png';
import giado from './images/giado.png';
import loablu from './images/loablu.png';
import phukien from './images/phukien.png';
import oplung from './images/oplung.png';
import sacduphong from './images/sacduphong.png';
import tainghe from './images/tainghe.png';
import { GrTextAlignLeft } from 'react-icons/gr';

const { Meta } = Card;

// Map danh mục với URL ảnh tương ứng
const categoryCodeMap = {
  'Ốp lưng': oplung,
  'Củ sạc': cusac,
  'Cáp sạc': capsac,
  'Tai nghe': tainghe,
  'Sạc dự phòng': sacduphong,
  'Giá đỡ': giado,
  'Loa bluetooth': loablu,
  'Linh kiện khác': phukien,
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
      const { data, error } = await supabase.from('categories').select('*');
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
    return (
      <div className="spinner-container">
        <Spin size="large" />
      </div>
    ); // Hiển thị loading nếu dữ liệu đang được tải
  }

  return (
    <div className="product-grid-container">
      <h3 className="text-center mb-4">ĐÚNG HÀNG - ĐÚNG GIÁ - ĐÚNG CHẤT LƯỢNG</h3>

      {/* Hàng 1: Hiển thị 8 danh mục trong cùng một hàng */}
      <Row gutter={[16, 16]} justify="center">
        {categories.slice(0, 8).map((category) => {
          const imageUrl = category.image_url || getCategoryImage(category.name);
          return (
            <Col
              key={category.id}
              xs={24}
              sm={12}
              md={6}
              lg={3}
              xl={3} // Ensure each card takes 1/8th of the row width
              className="d-flex justify-content-center"
            >
              <Card
                hoverable
                style={{ width: '15rem', height: '15rem' }}
                cover={
                  <img
                    alt={category.name}
                    src={imageUrl}
                    className="card-img"
                    style={{ height: '9rem', objectFit: 'contain', padding: '10px' }}
                  />
                }
              >
                <Meta title={category.name} style={{ textAlign: 'center' }}  />
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default HomeMenu;
