import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './landing.css';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== passwordAgain) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      const response = await axios.post(`http://${process.env.REACT_APP_BACKEND_HOST_NAME}:8000/user/register`, {
        username: username,
        email: email,
        password: password,
        password_again: passwordAgain
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        if (response.data.errors) {
          if (response.data.errors.username) {
            toast.error(`Username: ${response.data.errors.username}`);
          }
          if (response.data.errors.email) {
            toast.error(`Email: ${response.data.errors.email}`);
          }
        } else {
          toast.error('An error occurred while registering');
        }
      }
    } catch (error) {
      console.log(error);
      toast.error('An error occurred while registering');
    }
  }

  return (
    <>
      {/* <form onSubmit={handleSubmit}> */}
        <h1>Register</h1>
        <div>
          {/* <label>Username:</label>
          <input type="text" className="form-control" onChange={(e) => setUsername(e.target.value)} /> */}
          <TextField id="register-username" label="Username" variant="outlined" onChange={(e) => setUsername(e.target.value)} />
        </div>
        <br/>
        <div>
          {/* <label>Email:</label>
          <input type="email" className="form-control" onChange={(e) => setEmail(e.target.value)} /> */}
          <TextField id="register-email" label="E-Mail" variant="outlined" onChange={(e) => setEmail(e.target.value)} />
        </div>
        <br/>
        <div>
          {/* <label>Password:</label>
          <input type="password" className="form-control" onChange={(e) => setPassword(e.target.value)} /> */}
          <TextField id="register-password" label="Password" variant="outlined" type='password' onChange={(e) => setPassword(e.target.value)} />
        </div>
        <br/>
        <div>
          {/* <label>Password Again:</label>
          <input type="password" className="form-control" onChange={(e) => setPasswordAgain(e.target.value)} /> */}
          <TextField id="register-password-again" label="Password Again" variant="outlined" type='password' onChange={(e) => setPasswordAgain(e.target.value)} />
        </div>
        <br/>
        {/* <button type="submit" className="btn btn-primary">Register</button> */}
        <Button variant="contained" onClick={handleSubmit} className="register-button" >Register</Button>
      {/* </form> */}
      <ToastContainer />
    </>
  );
}

export default Register;
