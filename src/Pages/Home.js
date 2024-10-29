import React from "react";
import { Layout, Carousel } from "antd";
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import HomeBrand from "./HomeBrand"; // Import component ProductList
import { Link } from 'react-router-dom';

import HomeMenu from "./HomeMenu";
import bn1 from "./images/bn1.png";
import bn2 from "./images/bn2.png";
import bn4 from "./images/bn4.jpg"; 
import bn5 from "./images/bn5.jpg";

import "./CSS/Home.css";

const { Content } = Layout;

const Home = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />

      <Content style={{ padding: "50px" }}>
        {/* Slider */}
        <Carousel autoplay style={{ marginBottom: "50px", maxWidth: "100%", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
  <Link to="/ProductDetail/129">
    <img
      src={bn1}
      alt="First slide"
      style={{
        width: "100%",
        height: "auto",
        borderRadius: "10px",
        objectFit: "fill",
      }}
    />
  </Link>
</div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Link to="/ProductDetail/129">
            <img
              src={bn2}
              alt="First slide"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "10px",
                objectFit: "fill",
              }}
            />
            </Link>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Link to="/ProductDetail/116">
            <img
              src={bn4}
              alt="First slide"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "10px",
                objectFit: "fill",
              }}
            />
            </Link>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Link to="/ProductDetail/134">
            <img
              src={bn5}
              alt="First slide"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "10px",
                objectFit: "fill",
              }}
            />
            </Link>
          </div>
        </Carousel>
        <HomeMenu />
        {/* Danh sách sản phẩm của thương hiệu "iPhone" */}
        <HomeBrand brandName="Apple" /> {/* Truyền tên thương hiệu vào BrandName */}
        {/* Danh sách sản phẩm của thương hiệu "Samsung" */}
        <HomeBrand brandName="Samsung" /> {/* Truyền tên thương hiệu vào BrandName */}
        {/* Danh sách sản phẩm của thương hiệu "Wekome" */}
        <HomeBrand brandName="Wekome" /> {/* Truyền tên thương hiệu vào BrandName */}
      </Content>

      <Footer />
    </Layout>
  );
};

export default Home;
