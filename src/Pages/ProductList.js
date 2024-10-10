import React, { useEffect, useState } from "react";
import { Layout, Row, Col, Card, List, Spin, Carousel } from "antd";
import { supabase } from "../supabaseClient"; // Import Supabase client
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import "./CSS/ProductList.css";
import { PiTextbox } from "react-icons/pi";
import { Icon, KeyIcon } from "lucide-react";
import { IoIosSearch } from "react-icons/io";


const { Content } = Layout;
const { Meta } = Card;



const ProductList = () => {
  // Example product data
  // State lưu trữ danh sách sản phẩm và trạng thái tải
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null); // Loại sản phẩm được chọn

  //hàm search
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Fetch products from Supabase that match the search term
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .ilike('name', `%${searchTerm}%`); // Search by product name (case-insensitive)

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data); // Update the product list with search results
    }

    setLoading(false);
  };



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
    ? products.filter((product) => product.cate_id === selectedCategory)
    : products;

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
            {/* search sản phẩm*/}
            <div className="sidebar-widget mb-50">
              <h3 className="sidebar-title">Tìm kiếm sản phẩm</h3>
              <div className="sidebar-search">
                <div>
                  <form onSubmit={handleSearch}>
                    <input
                      type="text"
                      placeholder="Tìm kiếm tên sản phẩm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)} // Update search term state
                    />
                    <button type="submit">Tìm kiếm</button>
                  </form>
                </div>
              </div>
            </div>
            <h3 className="sidebar-title">Thể loại</h3>
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
                    ? `Sản phẩm của ${categories.find(
                      (cat) => cat.id === selectedCategory
                    )?.name}`
                    : "Tất cả sản phẩm"}
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
                            description={`Price: ${product.sell_price}VND`}
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
      </Content>


      {/* Footer */}
      <Footer />
    </Layout >
  );
};

export default ProductList;
