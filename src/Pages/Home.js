import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Carousel, Button } from 'react-bootstrap';
import { supabase } from "../supabaseClient"; // Import Supabase client
import Header from '../Components/Header/Header';
import bn1 from './images/bn1.jpg';

const Home = () => {
  // State lưu trữ danh sách sản phẩm
  const [products, setProducts] = useState([]);

  // Hàm lấy dữ liệu từ Supabase
  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*'); // 'products' là tên bảng trong Supabase

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data); // Lưu dữ liệu vào state
    }
  };

  // Sử dụng useEffect để fetch dữ liệu khi component được render
  useEffect(() => {
    fetchProducts();
  }, []);

  // Hàm render Header
  const renderHeader = () => {
    return <Header />;
  };

  return (
    <div style={styles.body}>
      {/* Header */}
      <div>{renderHeader()}</div>

      {/* Slider */}
      <Carousel style={styles.carouselContainer}>
        <Carousel.Item>
          <img className="d-block w-100" src={bn1} alt="First slide" style={styles.carouselImage} />
          <Carousel.Caption>
            <h3>Welcome To Our Gift Shop</h3>
            <p>Shop for the best gifts here.</p>
            <Button href="#contact" variant="primary">Contact Us</Button>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://cvsjmtyunxlaoneqvklm.supabase.co/storage/v1/object/public/Image/Screenshot%202024-09-23%20014656.jpg"
            alt="First slide"
            style={styles.carouselImage}
          />
          <Carousel.Caption>
            <h3>Welcome To Shop Phụ Kiện VIP</h3>
            <p>Find amazing products here.</p>
            <Button href="#contact" variant="primary">Contact Us</Button>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      {/* Shop Section */}
      <section id="shop" className="shop_section py-5">
        <Container>
          <h2 className="text-center mb-5">Latest Products</h2>
          <Row>
            {products.map((product, index) => (
              <Col key={index} sm={6} md={4} lg={3} className="mb-4">
                <Card className="text-center" style={styles.card}>
                  {/* Hiển thị ảnh sản phẩm từ Supabase */}
                  <Card.Img variant="top" src={product.img} />
                  <Card.Body>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text>Price: ${product.price}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer style={styles.footer} className="text-center py-4">
        <Container>
          <p>&copy; {new Date().getFullYear()} Shop Phụ Kiện VIP</p>
        </Container>
      </footer>
    </div>
  );
};

export default Home;

const styles = {
  body: {
    fontFamily: 'Arial, sans-serif',
  },
  carouselContainer: {
    maxWidth: '600px',
    margin: '0 auto',
  },
  carouselImage: {
    height: '300px',
    objectFit: 'cover',
  },
  card: {
    border: 'none',
  },
  footer: {
    backgroundColor: '#f8f9fa',
  },
};

