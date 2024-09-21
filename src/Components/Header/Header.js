import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import "./Header.css";
function Header() {
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
              <NavDropdown title="Tài Khoản" id="collapsible-nav-dropdown">
                <NavDropdown.Item href="#action/3.2">
                  Đăng nhập
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Đăng kí</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link className="nav-link-custom">Giỏ hàng</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default Header;
