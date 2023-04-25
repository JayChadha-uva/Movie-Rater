import React, { useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  const [registerStatus, setRegisterStatus] = useState("");
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    Axios.post("http://localhost:1234/login", {
      email: email,
      password: password,
    }).then((response) => {
      if (response.data.message === "Login successful") {
        sessionStorage.setItem("email", email);
        setLoginStatus(response.data.message);
        setEmail("");
        setPassword("");
        navigate(`/`);
      } else {
        setLoginStatus(response.data.message);
        setFirstName("");
        setLastName("");
        setPassword("");
      }
    });
  };

  const handleRegister = (event) => {
    event.preventDefault();
    Axios.post("http://localhost:1234/register", {
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: password,
    }).then((response) => {
      if (response.data.message) {
        setRegisterStatus(response.data.message);
      } else {
        setRegisterStatus("ACCOUNT CREATED SUCCESSFULLY");
        setEmail("");
        setFirstName("");
        setLastName("");
        setPassword("");
      }
    });
  };

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center">
        <div className="col-md-6 col-lg-4">
          <form onSubmit={handleLogin}>
            <h4>Login Here</h4>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email*
              </label>
              <input
                type="text"
                className="form-control"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password*
              </label>
              <input
                type="password"
                className="form-control"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>
            <div className="mb-3">
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </div>
            <h1
              style={{
                color: "red",
                fontSize: "15px",
                textAlign: "center",
                marginTop: "20px",
              }}
            >
              {loginStatus}
            </h1>
          </form>
        </div>
      </div>
      <div className="row justify-content-center align-items-center">
        <div className="col-md-6 col-lg-4">
          <form onSubmit={handleRegister}>
            <h4>Register Here</h4>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email Address*
              </label>
              <input
                type="text"
                className="form-control"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                First Name*
              </label>
              <input
                type="text"
                className="form-control"
                name="username"
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">
                Last Name*
              </label>
              <input
                type="text"
                className="form-control"
                name="lastName"
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password*
              </label>
              <input
                type="password"
                className="form-control"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>
            <div className="mb-3">
              <button type="submit" className="btn btn-primary">
                Create an account
              </button>
            </div>
            <h1
              style={{
                fontSize: "15px",
                textAlign: "center",
                marginTop: "20px",
              }}
            >
              {registerStatus}
            </h1>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
