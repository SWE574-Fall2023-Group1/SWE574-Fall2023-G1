import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './landing.css';
import mainPhoto from '../../assets/images/homePage4.png'

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');

  const navigate = useNavigate();

  const navigatetologin = (e) => {
    navigate('/login');
    return;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== passwordAgain) {
      toast.error("Passwords don't match");
      return;
    }
    axios.post(`http://${process.env.REACT_APP_BACKEND_HOST_NAME}:8000/user/register`, {
      username: username,
      email: email,
      password: password,
      password_again: passwordAgain
    }).then(response => {
      toast.success(response.data.message);
      navigate('/login');
    }).catch(error => {
      if (error.response && error.response.data) {
        if (error.response.data.username) {
          toast.error(`Username: ${error.response.data.username}`);
        }
        if (error.response.data.email) {
          toast.error(`Email: ${error.response.data.email}`);
        }
      } else {
        toast.error('An error occurred while registering');
      }
    });
  }

  return (
    <>
      {/* <form onSubmit={handleSubmit}> */}
      <div style={{width: '100%', height: '100%', position: 'relative'}}>
        <div style={{width: 960, height: 1005, left: 550, top: 0, position: 'absolute', background: 'white', borderTopLeftRadius: 40, borderTopRightRadius: 40, overflow: 'hidden'}}>
            <div style={{width: 339, height: 53, left: 304, top: 140, position: 'absolute', color: '#2C2A2A', fontSize: 40, fontFamily: 'Inter', fontWeight: '700', wordWrap: 'break-word'}}>Create Account</div>
                 {/* <button type="submit" className="btn btn-primary">Register</button> */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  className="register-button"
                  style={{
                    width: 473,
                    height: 53,
                    paddingLeft: 40,
                    paddingRight: 40,
                    paddingTop: 15,
                    paddingBottom: 15,
                    left: 312,
                    top: 570,
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
                  Create Account
              </Button>
            <div style={{ width: 473, height: 59, left: 304, top: 240, position: 'absolute', background: 'white', borderRadius: 8, padding: 8 }}>
                <TextField
                    id="register-username"
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
                            id="register-email"
                            label="E-Mail"
                            onChange={(e) => setEmail(e.target.value)}
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
            <div style={{width: 473, height: 59, left: 304, top: 400, position: 'absolute', background: 'white', borderRadius: 8, padding: 8}}>
                {/* <label>Password:</label>
                  <input type="password" className="form-control" onChange={(e) => setPassword(e.target.value)} /> */}
                <TextField
                                id="register-password"
                                label="Password"
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
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
            <div style={{width: 473, height: 59, left: 304, top: 480, position: 'absolute', background: 'white', borderRadius: 8, padding: 8}} >
                  {/* <label>Password Again:</label>
                   <input type="password" className="form-control" onChange={(e) => setPasswordAgain(e.target.value)} /> */}
                  <TextField
                                      id="register-password-again"
                                      label="Password Again"
                                      type="password"
                                      onChange={(e) => setPasswordAgain(e.target.value)}
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
            <div style={{left: 307, top: 632, position: 'absolute'}}><span style={{color: '#7C7A7A', fontSize: 16, fontFamily: 'Inter', fontWeight: '500', wordWrap: 'break-word' }} >Already have an account? </span><button onClick= {navigatetologin} style= {{color: '#AF49FF', fontSize: 16, fontFamily: 'Inter', fontWeight: '500', wordWrap: 'break-word', cursor: 'pointer', border: 'none', background:'none'}} >Login</button></div>
        </div>
        <img style={{width: 449, height: 400, left: 310, top: 200, position: 'absolute'}} src={mainPhoto} />
      </div>

      {/* </form> */}
      <ToastContainer />
    </>
  );
}

export default Register;
