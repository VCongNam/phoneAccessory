import React, { useEffect, useState } from "react";
import { Layout, Row, Col, Card, Input, List, Spin, Button } from "antd";
import { supabase } from "../supabaseClient";
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import "./CSS/ProductList.css";

const { Content } = Layout;
const { Meta } = Card;
const { Search } = Input;

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  // Search products by name
  const handleSearch = async (value) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .ilike("name", `%${value}%`);

    if (error) {
      console.error("Error fetching products:", error);
    } else {
      setProducts(data);
    }

    setLoading(false);
  };

  // Fetch all products
  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*");
    if (error) {
      console.error("Error fetching products:", error);
    } else {
      setProducts(data);
    }
    setLoading(false);
  };

  // Fetch all categories
  const fetchCategories = async () => {
    const { data, error } = await supabase.from("categories").select("*");
    if (error) {
      console.error("Error fetching categories:", error);
    } else {
      setCategories(data);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.cate_id === selectedCategory)
    : products;

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  const handleProductClick = (id) => {
    navigate(`/ProductDetail/${id}`);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />

      <Content style={{ padding: "50px" }}>
        <Row
          justify="center" // Căn giữa theo trục ngang
          align="middle" // Căn giữa theo trục dọc
          gutter={[16, 16]}
        >
          {/* Categories and Search */}
          <Col xs={24} sm={6}>
            <Card title="Tìm kiếm sản phẩm" bordered={false}>
              <Search
                placeholder="Nhập tên sản phẩm"
                allowClear
                enterButton="Tìm kiếm"
                size="large"
                onSearch={handleSearch}
              />
            </Card>

            <Card
              title="Thể loại sản phẩm"
              bordered={false}
              style={{ marginTop: 20 }}
            >
              <List
                dataSource={categories}
                renderItem={(category) => (
                  <List.Item
                    onClick={() => handleCategoryClick(category.id)}
                    style={{
                      cursor: "pointer",
                      backgroundColor:
                        selectedCategory === category.id ? "#e6f7ff" : "white",
                    }}
                  >
                    {category.name}
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          {/* Product List */}
          <Col xs={24} sm={16}>
            <h2 className="text-center">
              {selectedCategory
                ? `Sản phẩm của ${
                    categories.find((cat) => cat.id === selectedCategory)?.name
                  }`
                : "Tất cả sản phẩm"}
            </h2>

            {loading ? (
              <div className="spinner-container">
                <Spin size="large" />
              </div>
            ) : (
              <Row gutter={[16, 16]}>
                {filteredProducts.map((product) => (
                  <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                    <Card
                      hoverable
                      cover={
                        <img
                          alt={product.name}
                          src={product.img}
                          style={{ height: "200px", objectFit: "cover" }}
                        />
                      }
                      actions={[
                        <Button
                          type="primary"
                          onClick={() => handleProductClick(product.product_id)}
                        >
                          Xem chi tiết
                        </Button>,
                      ]}
                    >
                      <Meta
                        title={product.name}
                        description={`Giá: ${product.sell_price.toLocaleString()} VND`}
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        </Row>
      </Content>

      <Footer />
    </Layout>
  );
};

export default ProductList;
