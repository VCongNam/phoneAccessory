import React, { useEffect, useState } from "react";
import { Layout, Row, Col, Card, Carousel, Button, Spin } from "antd";
import { supabase } from "../supabaseClient"; // Import Supabase client
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import "./CSS/Home.css";

const { Content } = Layout;
const { Meta } = Card;

const Home = () => {
  // State lưu trữ danh sách sản phẩm và trạng thái tải
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatVisible, setChatVisible] = useState(false); // State quản lý hiển thị hộp chat
  const [userMessage, setUserMessage] = useState(""); // State quản lý tin nhắn người dùng
  const [messages, setMessages] = useState([]); // State lưu trữ tin nhắn trò chuyện

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

  // Hàm bật/tắt hộp chat
  const toggleChat = () => {
    setChatVisible(!chatVisible);
  };

  // Hàm gửi tin nhắn người dùng và xử lý AI trả lời
  const sendMessage = async () => {
    if (!userMessage) return;

    // Hiển thị tin nhắn của người dùng
    setMessages((prevMessages) => [...prevMessages, { sender: "Bạn", text: userMessage }]);

    // Gọi API OpenAI GPT (giả định)
    const aiReply = await fetchAIReply(userMessage);

    // Hiển thị tin nhắn trả lời từ AI
    setMessages((prevMessages) => [...prevMessages, { sender: "AI", text: aiReply }]);

    // Xóa trường nhập liệu
    setUserMessage("");
  };

  // Hàm giả định để gọi OpenAI GPT (hoặc dịch vụ AI khác)
  const fetchAIReply = async (message) => {
    // Thay thế API key OpenAI thật ở đây
    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer YOUR_API_KEY", // API key OpenAI của bạn
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // hoặc GPT-4 nếu có quyền truy cập
        prompt: `User: ${message}\nAI:`,
        max_tokens: 100,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    return data.choices[0].text.trim();
  };

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
              src="https://cvsjmtyunxlaoneqvklm.supabase.co/storage/v1/object/public/Image/Screenshot%202024-09-23%20014656.jpg"
              alt="First slide"
              style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
            />
            <div className="carousel-caption">
              <h3>Chào mừng tới với cửa hàng Phụ Kiện VIP.</h3>
              <p>Tất cả sản phẩm bạn muốn đều có ở đây.</p>
              <Button type="primary" href="#contact">
                Contact Us
              </Button>
            </div>
          </div>
        </Carousel>

        {/* Shop Section */}
        <section id="shop" className="shop_section" style={{ padding: "50px 0" }}>
          <div className="container">
            <h2 className="text-center mb-5">Sản phẩm mới nhất</h2>
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
                      <Meta title={product.name} description={`Price: $${product.sell_price}`} />
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

      {/* Biểu tượng hộp thư và hộp chat */}
      <div className="mail-icon" onClick={toggleChat}>
        ✉️
      </div>
      {chatVisible && (
        <div className="chat-box">
          <div className="chat-header">Hỗ trợ AI</div>
          <div className="chat-content">
            {messages.map((msg, index) => (
              <div key={index}>
                <strong>{msg.sender}:</strong> {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Nhập tin nhắn..."
            />
            <Button onClick={sendMessage}>Gửi</Button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Home;
