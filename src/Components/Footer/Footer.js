import React from "react";
import { Container, Row, Col } from "react-bootstrap";

function Footer() {
  return (
    <footer className="bg-light text-center text-lg-start">
      <Container className="p-4">
        <Row>
          <Col lg={12} md={12} className="mb-4 mb-md-0">
            <h5 className="text-uppercase">Galaxy Gadget</h5>
            <p>
            lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciuntlorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt
            </p>
          </Col>
        </Row>
      </Container>

      <div
        className="text-center p-3"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
      >
        © 2024 Copyright
      </div>
    </footer>
  );
}

export default Footer;
