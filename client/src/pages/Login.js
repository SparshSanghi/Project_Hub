import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [isSignup, setIsSignup] = useState(false);

  const [data, setData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async () => {
    try {
      if (isSignup) {
        await axios.post('http://localhost:5000/api/auth/signup', data);
        alert("Signup successful! Now login.");
        setIsSignup(false);
      } else {
        const res = await axios.post('http://localhost:5000/api/auth/login', data);

        localStorage.setItem("token", res.data.token);
        alert("Logged in!");

        window.location.reload();
      }
    } catch (err) {
      alert("Error occurred");
      console.log(err);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: "400px", margin: "100px auto" }}>

        <h2 className="section-title">
          {isSignup ? "Signup" : "Login"}
        </h2>

        {isSignup && (
          <input
            className="input"
            placeholder="Name"
            onChange={e => setData({ ...data, name: e.target.value })}
          />
        )}

        <input
          className="input"
          placeholder="Email"
          onChange={e => setData({ ...data, email: e.target.value })}
        />

        <input
          type="password"
          className="input"
          placeholder="Password"
          onChange={e => setData({ ...data, password: e.target.value })}
        />

        <button className="button" onClick={handleSubmit}>
          {isSignup ? "Signup" : "Login"}
        </button>

        <p style={{ marginTop: "10px" }}>
          {isSignup ? "Already have an account?" : "New user?"}
          <span
            onClick={() => setIsSignup(!isSignup)}
            style={{ color: "blue", cursor: "pointer", marginLeft: "5px" }}
          >
            {isSignup ? "Login" : "Signup"}
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;