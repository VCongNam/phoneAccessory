import React, { useState } from "react";
import { Button, Form, Container } from "react-bootstrap";
import { supabase } from "../supabaseClient"; // Import your Supabase client
import "./CSS/Log.css";

const Auth = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (isRegister) {
      // Registration process
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      const { error: insertError } = await supabase.from("account").insert([
        {
          user_name: email, // Insert email as user_name
          password: password, // Insert password as plain text
          role_id: 1, // Default role or any other field
        },
      ]);

      if (insertError) {
        setError(`Error inserting into account table: ${insertError.message}`);
      } else {
        console.log("User registered and data inserted into account table.");
      }
    } else {
      // Login process
      const { data, error: fetchError } = await supabase
        .from("account")
        .select("*")
        .eq("user_name", email)
        .eq("password", password);

      if (fetchError) {
        setError(`Error fetching user: ${fetchError.message}`);
        return;
      }

      if (data.length > 0) {
        console.log("Login successful:", data[0]);
        // Redirect to another page or save login session
      } else {
        setError("Invalid email or password");
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
          <Form.Label className="form-label">Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="form-control"
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
