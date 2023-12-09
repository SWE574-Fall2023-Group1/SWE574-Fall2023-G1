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

  return (
    <div className="container">
      {/* <form onSubmit={handleSubmit}> */}
      <div style={{width: '100%', height: '100%', position: 'relative'}}>
        <div style={{width: 900, height: 1005, left: 550, top: 0, position: 'absolute', background: 'white', borderTopLeftRadius: 40, borderTopRightRadius: 40, overflow: 'hidden'}}>
            <div style={{width: 339, height: 53, left: 304, top: 140, position: 'absolute', color: '#2C2A2A', fontSize: 40, fontFamily: 'Inter', fontWeight: '700', wordWrap: 'break-word'}}>Welcome</div>
                 {/* <button type="submit" className="btn btn-primary">Login</button> */}
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
                    left: 312,
                    top: 430,
                    position: 'absolute',
                    borderRadius: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 10,
                    display: 'inline-flex',
                    cursor: 'pointer', // Add this to make it look clickable
                    fontSize: 16,
                    fontFamily: 'Inter',
                    fontWeight: '700',
                    wordWrap: 'break-word',
                    textTransform: 'none',
                    backgroundColor: 'purple',
                  }}
                >
                  Login
              </Button>
              <div style={{ width: 473, height: 59, left: 304, top: 240, position: 'absolute', background: 'white', borderRadius: 8, padding: 8 }}>
                {/* <label>Username:</label>
                  <input type="text" className="form-control" onChange={(e) => setUsername(e.target.value)} /> */}
                <TextField
                    id="login-username"
                    label="Username"
                    onChange={(e) => setUsername(e.target.value)}
                    style={{
                        width: '100%',
                        height: '100%', // Set height to '100%'
                        color: '#7C7A7A',
                        borderRadius: 8,
                        fontSize: 16,
                        fontFamily: 'Inter',
                        fontWeight: '500',
                        wordWrap: 'break-word',
                        boxSizing: 'border-box', // Include padding and borders in the total width and height
                    }}
                />
            </div>
            <div style={{width: 473, height: 59, left: 304, top: 320, position: 'absolute', background: 'white', borderRadius: 8, padding: 8}}>
                    <TextField
                            id="login-password"
                            label="Password"
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            style={{
                                width: '100%',
                                height: '100%', // Set height to '100%'
                                color: '#7C7A7A',
                                borderRadius: 8,
                                fontSize: 16,
                                fontFamily: 'Inter',
                                fontWeight: '500',
                                wordWrap: 'break-word',
                                boxSizing: 'border-box', // Include padding and borders in the total width and height
                            }}
                    />
                </div>
                <div style={{left: 307, top: 492, position: 'absolute'}}><span style={{color: '#7C7A7A', fontSize: 16, fontFamily: 'Inter', fontWeight: '500', wordWrap: 'break-word' }} >Don't you have any account yet? </span><button onClick= {navigatetoforgotpassword} style= {{color: '#AF49FF', fontSize: 16, fontFamily: 'Inter', fontWeight: '500', wordWrap: 'break-word', cursor: 'pointer', border: 'none', background:'none'}} >Register Now!</button></div>
                <div style={{left: 307, top: 400, position: 'absolute'}}><span style={{color: '#2C2A2A', fontSize: 16, fontFamily: 'Inter', fontWeight: '500', wordWrap: 'break-word' }} ></span><button onClick= {navigatetoregister} style= {{color: '#AF49FF', fontSize: 16, fontFamily: 'Inter', fontWeight: '500', wordWrap: 'break-word', cursor: 'pointer', border: 'none', background:'none'}} >Forgot password?</button></div>
        </div>
        <img style={{width: 449, height: 400, left: 310, top: 200, position: 'absolute'}} src={mainPhoto} />
      </div>
        <ToastContainer position="bottom-right" autoClose={5000} />
        <br/>
      {/* </form> */}
    </div>
  );
}

export default Login;
