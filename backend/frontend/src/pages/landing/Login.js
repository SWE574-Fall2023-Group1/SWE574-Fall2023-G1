import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './landing.css';
import mainPhoto from '../../assets/images/homePage4.png';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const navigatetoregister = () => {
    navigate('/resetPassword');
  };

  const navigatetoforgotpassword = () => {
    navigate('/register');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`http://${process.env.REACT_APP_BACKEND_HOST_NAME}:8000/user/login`, {
      username: username,
      password: password
    }, { withCredentials: true }).then(response => {
      if (response.status === 201) {
        onLoginSuccess();
        toast.success('Login successful!');
        navigate('/homepage');
      } else {
        toast.error('Unexpected response from server');
      }
    }).catch(error => {
      if (error.response) {
        if (error.response.data && error.response.data.msg === 'Invalid username or password') {
          toast.error('Invalid username or password');
        } else {
          toast.error('Unexpected error');
        }
      } else {
        toast.error('Request failed:', error.message);
      }
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="container" style={{display: "flex", "flex-direction": "column", "justify-content": "center", "align-items": "center", "text-align": "center", margin: "auto"}}>
      {/* <form onSubmit={handleSubmit}> */}
      <div style={{display: "flex", "flex-direction": "column", "justify-content": "center", "align-items": "center", "text-align": "center", margin: "auto", width: '100%', height: '100%', "flex-wrap": "wrap"}}>
      <div style={{height: "2em"}}></div>
        <div style={{display: "flex", "flex-direction": "column", "justify-content": "center", "align-items": "center", "text-align": "center", margin: "auto", background: 'white', borderRadius: 40, "flex-wrap": "wrap", overflow: "auto", "min-width": "80%"}}>
        <div style={{height: "2em"}}></div>
        <img style={{display: "flex", "flex-direction": "column", "justify-content": "center", "align-items": "center", "text-align": "center", width: 449}} src={mainPhoto} />
            <h2>Every Memory Counts:</h2>
            <h3>Write, Share, Relive.</h3>
                 {/* <button type="submit" className="btn btn-primary">Login</button> */}
              <div style={{display: "flex", "flex-direction": "column", "justify-content": "center", "align-items": "center", "text-align": "center", width: 473, height: 59, background: 'white', borderRadius: 8, padding: 8 }}>
                {/* <label>Username:</label>
                  <input type="text" className="form-control" onChange={(e) => setUsername(e.target.value)} /> */}
                <TextField
                    id="login-username"
                    label="Username"
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={handleKeyPress}
                    style={{
                        width: '100%',
                        height: '100%', // Set height to '100%'
                        color: '#7C7A7A',
                        borderRadius: 8,
                        fontSize: 16,
                        fontFamily: "'Josefin Sans', sans-serif",
                        fontWeight: '500',
                        wordWrap: 'break-word',
                        boxSizing: 'border-box', // Include padding and borders in the total width and height
                    }}
                />
            </div>
            <div style={{display: "flex", "flex-direction": "column", "justify-content": "center", "align-items": "center", "text-align": "center", margin: "auto", width: 473, height: 59,background: 'white', borderRadius: 8, padding: 8}}>
                    <TextField
                            id="login-password"
                            label="Password"
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyPress={handleKeyPress}
                            type="password"
                            style={{
                                width: '100%',
                                height: '100%', // Set height to '100%'
                                color: '#7C7A7A',
                                borderRadius: 8,
                                fontSize: 16,
                                fontFamily: "'Josefin Sans', sans-serif",
                                fontWeight: '500',
                                wordWrap: 'break-word',
                                boxSizing: 'border-box', // Include padding and borders in the total width and height
                            }}
                    />
        </div>
        <div style={{height: "2em"}}></div>
        <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  className="login-button"
                  style={{
                    width: 473,
                    height: 53,
                    paddingLeft: 40,
                    paddingRight: 40,
                    paddingTop: 15,
                    paddingBottom: 15,
                    borderRadius: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 10,
                    display: 'inline-flex',
                    cursor: 'pointer',
                    fontSize: 16,
                    fontFamily: "'Josefin Sans', sans-serif",
                    fontWeight: '700',
                    wordWrap: 'break-word',
                    textTransform: 'none',
                    backgroundColor: 'purple',
                    margin: "auto"
                  }}
                >Login</Button>
                <div style={{height: "2em"}}></div>
                <div style={{}}><span style={{color: '#7C7A7A', fontSize: 16, fontFamily: "'Josefin Sans', sans-serif", fontWeight: '500', wordWrap: 'break-word' }} >Don't have any account yet? </span><button onClick= {navigatetoforgotpassword} style= {{color: '#AF49FF', fontSize: 16, fontFamily: "'Josefin Sans', sans-serif", fontWeight: '500', wordWrap: 'break-word', cursor: 'pointer', border: 'none', background:'none'}} >Register Now!</button></div>
                <div style={{height: "2em"}}></div>
                <div style={{}}><span style={{color: '#2C2A2A', fontSize: 16, fontFamily: "'Josefin Sans', sans-serif", fontWeight: '500', wordWrap: 'break-word' }} ></span><button onClick= {navigatetoregister} style= {{color: '#AF49FF', fontSize: 16, fontFamily: "'Josefin Sans', sans-serif", fontWeight: '500', wordWrap: 'break-word', cursor: 'pointer', border: 'none', background:'none'}} >Forgot password?</button></div>
                <div style={{height: "2em"}}></div>
        </div>
      </div>
        <ToastContainer position="bottom-right" autoClose={5000}  />
        <div style={{height: "2em"}}></div>
      {/* </form> */}
    </div>
  );
}

export default Login;
