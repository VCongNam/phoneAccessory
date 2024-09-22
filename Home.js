import React from 'react';
import { Container, Navbar, Nav, Form, Button, Carousel, Row, Col, Card } from 'react-bootstrap';

const Home = () => {
  return (
    <div style={styles.body}>
      {/* Header */}
      <Navbar expand="lg" style={styles.navbar} className="bg-light">
        <Container>
          <Navbar.Brand href="#home">Shop Phụ Kiện VIP</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#shop">Shop</Nav.Link>
              <Nav.Link href="#why">Why Us</Nav.Link>
              <Nav.Link href="#testimonial">Testimonial</Nav.Link>
              <Nav.Link href="#contact">Contact Us</Nav.Link>
            </Nav>
            <Form inline>
              <Button variant="outline-success" className="mr-2">Login</Button>
              <Button variant="outline-success">Cart</Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Slider */}
      <Carousel style={styles.carouselContainer}>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/images/bn1.jpg"
            alt="First slide"
            style={styles.carouselImage}
          />
          <Carousel.Caption>
            <h3>Welcome To Our Gift Shop</h3>
            <p>Shop for the best gifts here.</p>
            <Button href="#contact" variant="primary">
              Contact Us
            </Button>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/images/bn2.jpg"
            alt="Second slide"
            style={styles.carouselImage}
          />
          <Carousel.Caption>
            <h3>Welcome To Shop Phụ Kiện VIP</h3>
            <p>Find amazing products here.</p>
            <Button href="#contact" variant="primary">
              Contact Us
            </Button>
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
  navbar: {
    marginBottom: '20px',
  },
  carouselContainer: {
    maxWidth: '600px', // Đặt chiều rộng tối đa của Carousel
    margin: '0 auto', // Đặt Carousel ở giữa trang
  },
  carouselImage: {
    height: '300px', // Chiều cao của ảnh Carousel
    objectFit: 'cover', // Giữ ảnh phù hợp với kích thước
  },
  card: {
    border: 'none',
  },
  footer: {
    backgroundColor: '#f8f9fa',
  }
};
  
const products = [
  { name: 'Ring', price: 200, img: 'images/test.png' },
  { name: 'Watch', price: 300, img: 'images/test.png' },
  { name: 'Teddy Bear', price: 110, img: 'images/test.png' },
  { name: 'Flower Bouquet', price: 45, img: 'images/test.png' },
  { name: 'Teddy Bear', price: 95, img: 'images/test.png' },
  { name: 'Flower Bouquet', price: 70, img: 'images/test.png' },
  { name: 'Watch', price: 400, img: 'images/test.png' },
  { name: 'Ring', price: 450, img: 'images/test.png' },
];