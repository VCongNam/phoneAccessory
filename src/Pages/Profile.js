import Header from "../Components/Header/Header";
import { Container, Navbar, Nav, Form, Button } from "react-bootstrap";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Profile() {
  const notify = () =>
    toast.success("Update success", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  return (
    <>
      <ToastContainer />
      <NavWrapper>
        <Navbar expand="lg" style={styles.navbar} className="bg-light">
          <Container>
            <Navbar.Brand href="#home">Shop Phụ Kiện VIP</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" className="nav_collapse">
              <Nav className="ml-auto">
                <Nav.Link href="#home">Home</Nav.Link>
                <Nav.Link href="#shop">Shop</Nav.Link>
                <Nav.Link href="#why">Why Us</Nav.Link>
                <Nav.Link href="#testimonial">Testimonial</Nav.Link>
                <Nav.Link href="#contact">Contact Us</Nav.Link>
              </Nav>
              <Form inline>
                <Button variant="outline-success" className="mr-2">
                  Login
                </Button>
                <Button variant="outline-success">Cart</Button>
              </Form>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </NavWrapper>
      <ProfileWrapper>
        <div class="profile-container">
          <div class="grid-container">
            <div class="card-container left">
              <div class="card profile-card">
                <div class="card-header">
                  <p class="header-text">Profile</p>
                  <span class="badge">Active</span>
                </div>
                <div class="card-content profile-image">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/640px-User_icon_2.svg.png"
                    class="profile-img"
                  />
                </div>
              </div>
              <div class="card detail_card">
                <div class="card-header">
                  <p class="header-text text-center">About Me</p>
                </div>
                <div class="card-content">
                  <p class="intro-text">
                    Hi, I am a software engineer with 5 years of experience in
                    web development. I have experience working with React,
                    TypeScripts, Redux, Node.js, and ASP.Net Core Web API.
                  </p>
                </div>
              </div>
              <div class="card login_card">
                <div class="card-header">
                  <p class="header-text text-center">Last Login</p>
                </div>
                <div class="card-content text-center text_lastlogin">
                  <p>
                    Last login at :
                    <span className="text_lastlogin"> 08:33 23/09/2024</span>
                  </p>
                </div>
              </div>
            </div>
            <div class="card contact-info">
              <div class="card-header">
                <p class="header-text">Contact Information</p>
              </div>
              <div class="card-content grid">
                <div>
                  <p class="label">First Name</p>
                  <p class="info">Nguyen</p>
                </div>
                <div>
                  <p class="label">Last Name</p>
                  <p class="info">Henry</p>
                </div>
                <div>
                  <p class="label">Email</p>
                  <p class="info">henrywork@gmail.com</p>
                </div>
                <div>
                  <p class="label">Phone</p>
                  <p class="info">+84 987654321</p>
                </div>
              </div>
              <div class="card-footer">
                <p class="change-info-text">Change Information</p>
                <button class="update-btn" onClick={notify}>
                  Update
                </button>
              </div>
              <div class="card-content grid">
                <div class="input-group">
                  <label>First Name</label>
                  <input type="text" placeholder="First Name" />
                </div>
                <div class="input-group">
                  <label>Last Name</label>
                  <input type="text" placeholder="Last Name" />
                </div>
                <div class="input-group">
                  <label>About Me</label>
                  <input type="text" placeholder="About Me" />
                </div>
                <div class="input-group">
                  <label>Phone</label>
                  <input type="text" placeholder="Phone" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProfileWrapper>
    </>
  );
}

const styles = {
  body: {
    fontFamily: "Arial, sans-serif",
  },
  navbar: {
    width: "100%",
    marginBottom: "20px",
  },
  carouselContainer: {
    maxWidth: "600px",
    margin: "0 auto",
  },
  carouselImage: {
    height: "300px",
    objectFit: "cover",
  },
  card: {
    border: "none",
  },
  footer: {
    backgroundColor: "#f8f9fa",
  },
};

const NavWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  .nav_collapse {
    display: flex;
    justify-content: space-between;
  }
`;

const ProfileWrapper = styled.div`
  .profile-container {
    height: 100%;
    padding: 40px;
    overflow-y: auto;
  }

  .grid-container {
    display: flex;
    gap: 24px;
    height: 80% !important;

    padding-top: 24px;
    @media (max-width: 768px) {
      flex-direction: column;
    }
  }
  .left {
    height: 80dvh;
    .profile-card {
      height: 40%;
    }
    .detail_card {
      height: 40%;
      overflow: auto;
    }
    .login_card {
      height: 20%;
    }
  }
  .card-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 30%;
    @media (max-width: 768px) {
      width: 100%;
    }
  }

  .card {
    background-color: #f1f5f9;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px,
      rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
    border-radius: 8px;
    padding: 16px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    padding-bottom: 8px;
    border-radius: 8px;
  }

  .header-text {
    font-size: 20px;
  }

  .badge {
    background-color: #28a745;
    color: white;
    display: flex;
    align-items: center;
    height: 30px;
    width: 60px;
    justify-content: center;
    border-radius: 4px;
  }

  .profile-image {
    display: flex;
    justify-content: center;
  }

  .profile-img {
    width: 150px;
    height: 150px;
    border-radius: 40% 40%;
  }

  .card-content {
    font-size: 14px;
    padding: 12px;
    .text_lastlogin {
      font-weight: bold;
      color: #28a745;
    }
  }

  .text-center {
    text-align: center;
  }

  .contact-info {
    padding-bottom: 16px;
    width: 70%;
    height: 80dvh;
    @media (max-width: 768px) {
      width: 100%;
    }
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .label {
    font-weight: bold;
    color: black;
  }

  .info {
    color: grey;
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
    font-weight: bold;
    border-radius: 8px;
  }

  .update-btn {
    background-color: #28a745;
    color: white;
    padding: 8px 16px;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;
    width: 150px;
    height: 100%;
    border-radius: 8px;
  }

  .update-btn:hover {
    background-color: #218838;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  input {
    width: 80%;
    padding: 8px;
    border: 1px solid grey;
    border-radius: 4px;
    color: grey;
  }
`;
