import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './landing.css';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`http://${process.env.REACT_APP_BACKEND_HOST_NAME}:8000/user/login`, {
      username: username,
      password: password
    },{ withCredentials: true }).then(response => {
      if (response.status === 201) {

        onLoginSuccess();
        toast.success('Login successful!');
        navigate('/homepage');
        } else {
          toast.error('Invalid email or password');
        }
    }).catch(error => {
      console.log(error);
      if (error.response) {
        console.log(error.response.data);
      } else {
        console.log('Request failed:', error.message);
      }
    });
  }

  return (
    <div className="container">
      {/* <form onSubmit={handleSubmit}> */}
        <h1>Login</h1>

        <div className="form-group">
          {/* <label>Username:</label>
          <input type="text" className="form-control" onChange={(e) => setUsername(e.target.value)} /> */}
          <TextField id="login-username" label="Username" variant="outlined" onChange={(e) => setUsername(e.target.value)} />
        </div>
        <br/>
        <div className="form-group">
        <TextField id="login-password" label="Password" variant="outlined" type="password" onChange={(e) => setPassword(e.target.value)} />
        </div>
        <br/>
        <Button variant="contained" onClick={handleSubmit} className="login-button">Login</Button>

        {/* <button type="submit" className="btn btn-primary">Login</button> */}
        <ToastContainer position="bottom-right" autoClose={5000} />
        <br/>
        <div className="forgot-password-link">
          <Link to="/resetPassword">Forgot my password</Link>
        </div>
      {/* </form> */}
    </div>
  );
}

export default Login;
