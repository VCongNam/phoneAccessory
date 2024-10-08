import React, { useEffect, useState } from "react";
import { Layout, Row, Col, Card, List, Spin, Carousel } from "antd";
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
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null); // Loại sản phẩm được chọn

  // Hàm lấy danh sách sản phẩm từ Supabase
  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*");
    if (error) {
      console.error("Error fetching products:", error);
    } else {
      setProducts(data);
    }
    setLoading(false);
  };

  // Hàm lấy danh sách loại sản phẩm từ Supabase
  const fetchCategories = async () => {
    const { data, error } = await supabase.from("categories").select("*");
    if (error) {
      console.error("Error fetching categories:", error);
    } else {
      setCategories(data);
    }
  };

  // Sử dụng useEffect để fetch dữ liệu khi component được render
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Hàm lọc sản phẩm theo loại sản phẩm được chọn
  const filteredProducts = selectedCategory
    ? products.filter((product) => product.cate_id === selectedCategory).slice(0, 4)
    : products.slice(0, 4);

  // Hàm xử lý khi nhấn vào loại sản phẩm
  const handleCategoryClick = (categoryId) => {
    // Nếu người dùng nhấn vào loại sản phẩm đã chọn, hủy chọn (hiển thị lại tất cả sản phẩm)
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    } else {
      // Chọn loại sản phẩm khác
      setSelectedCategory(categoryId);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Header */}
      <Header />

      {/* Nội dung trang chủ */}
      <Content style={{ padding: "50px" }}>
        {/* Slider */}
        <Carousel autoplay style={{ marginBottom: "50px" }}>
          <div>
            <img
              src={bn1}
              alt="First slide"
              style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
            />
          </div>
          <div>
            <img
              src="https://cvsjmtyunxlaoneqvklm.supabase.co/storage/v1/object/public/Image/Screenshot%202024-09-23%20014656.jpg"
              alt="Second slide"
              style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
            />
          </div>
        </Carousel>

        <Row gutter={[16, 16]} style={{ marginTop: "50px" }}>
          {/* Danh sách loại sản phẩm */}
          <Col
            xs={24}
            sm={6}
            style={{
              backgroundColor: "#fff",
              borderRadius: "10px",
              padding: "20px",
             
            }}
          >
            <h2>Product Categories</h2>
            <List
             
              dataSource={categories}
              renderItem={(category) => (
                <List.Item
                  onClick={() => handleCategoryClick(category.id)} // Xử lý khi nhấn vào loại sản phẩm
                  style={{
                    cursor: "pointer",
                    backgroundColor:
                      selectedCategory === category.id ? "#e6f7ff" : "white",
                      maxHeight: "auto",
                  }}
                >
                  {category.name}
                </List.Item>
              )}
            />
          </Col>

          {/* Danh sách sản phẩm */}
          <Col xs={24} sm={18}>
            <section id="shop" className="shop_section">
              <div className="container">
                <h2 className="text-center mb-5">
                  {selectedCategory
                    ? `Products in ${categories.find(
                        (cat) => cat.id === selectedCategory
                      )?.name}`
                    : "All Products"}
                </h2>
                {loading ? (
                  <div className="spinner-container">
                    <Spin size="large" />
                  </div>
                ) : (
                  <Row gutter={[16, 16]}>
                    {filteredProducts.map((product, index) => (
                      <Col key={index} xs={24} sm={12} md={8} lg={6}>
                        <Card
                          hoverable
                          cover={
                            <img
                              alt={product.name}
                              src={product.img}
                              style={{ height: "200px", objectFit: "cover" }}
                            />
                          }
                        >
                          <Meta
                            title={product.name}
                            description={`Price: $${product.sell_price}`}
                          />
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )}
              </div>
            </section>
          </Col>
        </Row>
        <section className="why_section layout_padding">
      <div className="container">
        <div className="heading_container heading_center">
          <h2>Why Shop With Us</h2>
        </div>
        <Row gutter={[16, 16]} justify="center">
          <Col xs={24} sm={8}>
            <div className="box">
              <div className="img-boxwhy">
                <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V8a2 2 0 00-.76-1.53M16 11v6m-8-6v6m4-6v6" />
                </svg>
              </div>
              <div className="detail-box">
                <h5>Fast Delivery</h5>
                <p>Variations of passages of Lorem Ipsum available</p>
              </div>
            </div>
          </Col>

          <Col xs={24} sm={8}>
            <div className="box">
              <div className="img-boxwhy">
                <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v2a2 2 0 002 2h2a2 2 0 002-2v-2m-6 0V5a2 2 0 012-2h2a2 2 0 012 2v12m-6 0h6" />
                </svg>
              </div>
              <div className="detail-box">
                <h5>Free Shipping</h5>
                <p>Variations of passages of Lorem Ipsum available</p>
              </div>
            </div>
          </Col>

          <Col xs={24} sm={8}>
            <div className="box">
              <div className="img-boxwhy">
                <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-7-7v14" />
                </svg>
              </div>
              <div className="detail-box">
                <h5>Best Quality</h5>
                <p>Variations of passages of Lorem Ipsum available</p>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </section>





        
      </Content>
      

      {/* Footer */}
      <Footer />
    </Layout>
  );
};

export default Home;

