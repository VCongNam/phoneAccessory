import React, { useEffect, useState } from "react";
import { Layout, Row, Col, Card, Carousel, Button, Spin } from "antd";
import { supabase } from "../supabaseClient"; // Import Supabase client
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import bn1 from "./images/bn1.jpg";
import "./CSS/Home.css";

const { Content } = Layout;
const { Meta } = Card;

const Home = () => {
  // State lưu trữ danh sách sản phẩm và trạng thái tải
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hàm lấy dữ liệu từ Supabase
  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*"); // 'products' là tên bảng trong Supabase

    if (error) {
      console.error("Error fetching products:", error);
    } else {
      setProducts(data); // Lưu dữ liệu vào state
    }
    setLoading(false); // Dừng trạng thái loading sau khi fetch dữ liệu xong
  };

  // Sử dụng useEffect để fetch dữ liệu khi component được render
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Layout>
      {/* Header */}
      <Header />

      {/* Nội dung trang chủ */}
      <Content>
        {/* Slider */}
        <Carousel autoplay style={{ marginBottom: "50px" }}>
          <div>
            <img
              src={bn1}
              alt="First slide"
              style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
            />
            <div className="carousel-caption">
              <h3>Welcome To Our Gift Shop</h3>
              <p>Shop for the best gifts here.</p>
              <Button type="primary" href="#contact">
                Contact Us
              </Button>
            </div>
          </div>
          <div>
            <img
              src="https://cvsjmtyunxlaoneqvklm.supabase.co/storage/v1/object/public/Image/Screenshot%202024-09-23%20014656.jpg"
              alt="Second slide"
              style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
            />
            <div className="carousel-caption">
              <h3>Welcome To Shop Phụ Kiện VIP</h3>
              <p>Find amazing products here.</p>
              <Button type="primary" href="#contact">
                Contact Us
              </Button>
            </div>
          </div>
        </Carousel>

        {/* Shop Section */}
        <section id="shop" className="shop_section" style={{ padding: "50px 0" }}>
          <div className="container">
            <h2 className="text-center mb-5">Latest Products</h2>
            {loading ? (
              <div className="spinner-container">
                <Spin size="large" />
              </div>
            ) : (
              <Row gutter={[16, 16]}>
                {products.map((product, index) => (
                  <Col key={index} xs={24} sm={12} md={8} lg={6}>
                    <Card
                      hoverable
                      cover={<img alt={product.name} src={product.img} style={{ height: "200px", objectFit: "cover" }} />}
                    >
                      <Meta title={product.name} description={`Price: $${product.price}`} />
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </div>
        </section>
      </Content>

      {/* Footer */}
      <Footer />
    </Layout>
  );
};

export default Home;