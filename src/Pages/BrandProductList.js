import React, { useEffect, useState } from "react";
import { Layout, Row, Col, Card, Spin, Button } from "antd";
import { supabase } from "../supabaseClient";
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import { useParams } from "react-router-dom"; // Use to get brand ID from the URL
import "./CSS/ProductList.css";

const { Content } = Layout;
const { Meta } = Card;

const BrandProductList = () => {
  const [products, setProducts] = useState([]);
  const [brandName, setBrandName] = useState(""); // State to store brand name
  const [loading, setLoading] = useState(true);
  const { brandId } = useParams(); // Get brand ID from URL

  // Fetch products by brand ID
  const fetchProductsByBrand = async () => {
    setLoading(true);
    try {
      const { data: productsData, error: productError } = await supabase
      .from("products")
      .select(`*`)
      .eq("brand_id", brandId)
      .eq("status", 2)
      .gt("stock_quantity", 0)
      .order("isHot", { ascending: false });

      if (productError) throw productError;

      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products by brand:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch brand name by brand ID
  const fetchBrandName = async () => {
    try {
      const { data, error } = await supabase
        .from("brand")
        .select("name")
        .eq("brand_id", brandId)
        .single(); // Fetch the brand by ID

      if (error) throw error;

      setBrandName(data.name); // Set the brand name
    } catch (error) {
      console.error("Error fetching brand name:", error);
    }
  };

  useEffect(() => {
    fetchBrandName();
    fetchProductsByBrand();
  }, [brandId]);

  const handleProductClick = (id) => {
    // Navigate to product detail page
    window.location.href = `/ProductDetail/${id}`;
  };

  return (
    <Layout style={{ minHeight: "100vh" , backgroundColor: "#F9F4F2" }}>
      <Header />

      <Content style={{ padding: "50px" }}>
        <h2 className="text-center">Sản phẩm của thương hiệu {brandName}</h2> {/* Display brand name */}
        {loading ? (
          <div className="spinner-container">
            <Spin size="large" />
          </div>
        ) : (
          <Row gutter={[16, 16]} style={{  padding: "10px" }}>
            {products.map((product) => (
             <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
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
                 <Button type="primary" onClick={() => handleProductClick(product.product_id)}>
                   Xem chi tiết
                 </Button>,
               ]}
             >
               <Meta
                 title={product.name}
                 description={<p style={{ color: "#121214", marginTop: "10px" }}>Giá: {product.sell_price.toLocaleString()} VND</p>}
               />
             </Card>
           </Col>
            ))}
          </Row>
        )}
      </Content>

      <Footer />
    </Layout>
  );
};

export default BrandProductList;
