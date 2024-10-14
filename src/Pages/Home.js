import React from "react";
import { Layout, Carousel } from "antd";
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import HomeBrand from "./HomeBrand"; // Import component ProductList

import HomeMenu from "./HomeMenu";
import opip15 from "./images/opip15.jpg";
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
            <img
              src={opip15}
              alt="First slide"
              style={{
                width: "100%",
                height: "400px",
                borderRadius: "10px",
                objectFit: "fill",
              }}
            />
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
