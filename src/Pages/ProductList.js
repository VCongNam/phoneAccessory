import React, { useEffect, useState } from "react";
import { Layout, Row, Col, Card, Input, List, Spin, Button } from "antd";
import { supabase } from "../supabaseClient";
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import "./CSS/ProductList.css";

const { Content } = Layout;
const { Meta } = Card;
const { Search } = Input;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brand, setBrand] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams(); // Lấy id từ URL
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
    const { data, error } = await supabase.from("products").select("*").eq("status", 2);
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

  const fetchBrand = async () => {
    const { data, error } = await supabase.from("brand").select("*");
    if (error) {
      console.error("Error fetching categories:", error);
    } else {
      setBrand(data);
    }
  };

  useEffect(() => {
    fetchBrand();
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    console.log("Category ID:", id); // In ra id của dự án hien tai
    if (id) {
      const fetchProductByCate = async () => {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq("status", 2)
          .eq('cate_id', id);

        if (error) {
          console.error('Error fetching product:', error);
        } else {
          setProducts(data);
        }
        setLoading(false);
      };
      fetchProductByCate();
    }
  }, [id]);


  const handleCategoryClick = (categoryId) => {
    navigate(`/productlist/${categoryId}`);
  };

  const handleBrandClick = (brandid) => {
    alert(brandid);
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
          // align="middle" // Căn giữa theo trục dọc
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
                  >
                    {category.name}
                  </List.Item>
                )}
              />
            </Card>
            <Card
              title="Thể loại sản phẩm"
              bordered={false}
              style={{ marginTop: 20 }}
            >
              <List
                dataSource={brand}
                renderItem={(brand) => (
                  <List.Item
                    onClick={() => handleBrandClick(brand.brand_id)}
                  >
                    {brand.name}
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          {/* Product List */}
          <Col xs={24} sm={16}>
            <h2 className="text-center"
            
            >
              {id
                ? `Sản phẩm của ${categories.find((cat) => cat.id === parseInt(id))?.name}`
                : "Tất cả sản phẩm"}
            </h2>

            {loading ? (
              <div className="spinner-container">
                <Spin size="large" />
              </div>
            ) : (
              <Row gutter={[16, 16]}
              style={{  backgroundColor: "rgb(220 220 220)", padding: "10px"  }}
              
              >
                {products.map((product) => (
                  <Col key={product.id} xs={24} sm={12} md={8} lg={6} >
                    <Card
                      hoverable
                      cover={
                        <img
                          alt={product.name}
                          src={product.img[0]}
                          style={{ height: "auto", objectFit: "cover" }}
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
                        description={
                         <span style={{ color: "rgb(255 64 64)" }}>  Giá: {product.sell_price.toLocaleString()} VND</span>
                        }
                        
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