import { useState, useEffect } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import "./Header.css";

function Header() {
  // Quản lý trạng thái đăng nhập
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Giả lập việc lấy trạng thái đăng nhập từ localStorage hoặc API
  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedInStatus);
  }, []);

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem("isLoggedIn", "false"); // Giả lập việc lưu trạng thái vào localStorage
  };

  // Hàm xử lý đăng nhập (giả lập, trong thực tế bạn sẽ cần thực hiện qua API)            
  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  return (
    <div className="HeaderContainer">
      <Navbar collapseOnSelect expand="lg" className="navbar-custom">
        <Container>
          <Navbar.Brand className="navbar-brand-custom">
            Gadget Galaxy
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link className="nav-link-custom">Sản Phẩm</Nav.Link>
              
              {/* Kiểm tra trạng thái đăng nhập */}
              {!isLoggedIn ? (
                <NavDropdown title="Tài Khoản" id="collapsible-nav-dropdown">
                  <NavDropdown.Item onClick={handleLogin}>
                    Đăng nhập
                  </NavDropdown.Item>
                  <NavDropdown.Item href="#signup">Đăng kí</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <NavDropdown title="Profile" id="collapsible-nav-dropdown">
                  <NavDropdown.Item href="#profile">Thông tin cá nhân</NavDropdown.Item>
                  <NavDropdown.Item onClick={handleLogout}>
                    Đăng xuất
                  </NavDropdown.Item>
                </NavDropdown>
              )}

              <Nav.Link className="nav-link-custom">Giỏ hàng</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default Header;
