import React, { useState } from "react";
import { Button, Form, Container } from "react-bootstrap";
import { supabase } from "../supabaseClient";
import "./CSS/Log.css";

const Auth = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (isRegister) {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      const { error: insertError } = await supabase.from("account").insert([
        {
          user_name: phone,
          password: password,
          role_id: 1, // Default role (e.g., 'User')
        },
      ]);

      if (insertError) {
        setError(`Error inserting into account table: ${insertError.message}`);
      } else {
        console.log("User registered and data inserted.");
      }
    } else {
      const { data, error: fetchError } = await supabase
        .from("account")
        .select("*")
        .eq("user_name", phone)
        .eq("password", password);

      if (fetchError) {
        setError(`Error fetching user: ${fetchError.message}`);
        return;
      }

      if (data.length > 0) {
        console.log("Login successful:", data[0]);
        // Store the user's role
        localStorage.setItem("user", JSON.stringify(data[0]));
        // Redirect to the authorized area
        const u = JSON.parse(localStorage.getItem("user"));
        if (u.role_id === 1) {
        window.location.href = "/";
      }
      else {
        window.location.href = "/dashboard";
      }
    } else {
      setError("Invalid phone number or password");
    }
  }
};


const handleToggle = () => {
  setIsRegister(!isRegister);
};

return (
  <Container className="auth-container">
    <h1>{isRegister ? "Register" : "Login"}</h1>
    {error && <p className="error-message">{error}</p>}
    <Form
      onSubmit={handleSubmit}
      className={`auth-form ${isRegister ? "is-register" : "is-login"}`}
    >
      <Form.Group controlId="formBasicEmail" className="form-group">
        <Form.Label className="form-label">Phone</Form.Label>
        <Form.Control
          type="tel"
          placeholder="Phone number"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className="form-control"
          pattern="[0-9]{10}"
          required
        />
      </Form.Group>

      <Form.Group controlId="formBasicPassword" className="form-group">
        <Form.Label className="form-label">Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="form-control"
          required
        />
      </Form.Group>

      {isRegister && (
        <Form.Group
          controlId="formBasicConfirmPassword"
          className="form-group"
        >
          <Form.Label className="form-label">Confirm Password</Form.Label>
          <Form.Control
            type="password"
            required
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="form-control"
          />
        </Form.Group>
      )}

      <Button variant="primary" type="submit" className="auth-button">
        {isRegister ? "Register" : "Login"}
      </Button>
      <Button
        variant="secondary"
        onClick={handleToggle}
        className="auth-button"
      >
        {isRegister ? "Login" : "Register"}
      </Button>
    </Form>
  </Container>
);
};

export default Auth;
