import React, { useState } from "react";
import { Button, Form, Container } from "react-bootstrap";
import { supabase } from "../supabaseClient"; // Import your Supabase client

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
          role_id: 1
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
    <Container>
      <h1>{isRegister ? "Register" : "Login"}</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Form.Group>

        {isRegister && (
          <Form.Group controlId="formBasicConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </Form.Group>
        )}

        <Button variant="primary" type="submit">
          {isRegister ? "Register" : "Login"}
        </Button>
        <Button variant="secondary" onClick={handleToggle}>
          {isRegister ? "Login" : "Register"}
        </Button>
      </Form>
    </Container>
  );
};

export default Auth;
