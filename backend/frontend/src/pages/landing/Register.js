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
        if (error.response.data.success === false && error.response.data.msg) {
          // Display the error message as a pop-up
          toast.error(error.response.data.msg);
        } else {
          // Display a generic error message
          toast.error('An error occurred while registering');
        }
      } else {
        toast.error('An error occurred while registering');
      }
    });
  }
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
        <img style={{width: 449, display: "flex", "flex-direction": "column", "justify-content": "center", "align-items": "center", "text-align": "center"}} src={mainPhoto} />
        <div style={{height: "2em"}}></div>
            <div style={{width: 339, height: 53, color: '#2C2A2A', fontSize: 30, fontFamily: "'Josefin Sans', sans-serif", fontWeight: '700', wordWrap: 'break-word', display: "flex", "flex-direction": "column", "justify-content": "center", "align-items": "center", "text-align": "center"}}>Register</div>
            <div style={{height: "2em"}}></div>
            <div style={{ width: 473, height: 59, background: 'white', borderRadius: 8, padding: 8}}>
                <TextField
                    id="register-username"
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
              <div style={{width: 473, height: 59, background: 'white', borderRadius: 8, padding: 8}}>
                    <TextField
                            id="register-email"
                            label="E-Mail"
                            onChange={(e) => setEmail(e.target.value)}
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
            <div style={{width: 473, height: 59, background: 'white', borderRadius: 8, padding: 8}}>
                {/* <label>Password:</label>
                  <input type="password" className="form-control" onChange={(e) => setPassword(e.target.value)} /> */}
                <TextField
                                id="register-password"
                                label="Password"
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
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
            <div style={{width: 473, height: 59, background: 'white', borderRadius: 8, padding: 8}} >
                  {/* <label>Password Again:</label>
                   <input type="password" className="form-control" onChange={(e) => setPasswordAgain(e.target.value)} /> */}
                  <TextField
                                      id="register-password-again"
                                      label="Password Again"
                                      type="password"
                                      onChange={(e) => setPasswordAgain(e.target.value)}
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
            <div style={{height: "2em"}}></div>
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
                    borderRadius: 8,
                    gap: 10,
                    display: "flex",
                    "flex-direction": "column",
                    "justify-content": "center",
                    "align-items": "center",
                    "text-align": "center",
                    cursor: 'pointer', // Add this to make it look clickable
                    fontSize: 16,
                    fontFamily: "'Josefin Sans', sans-serif",
                    fontWeight: '700',
                    wordWrap: 'break-word',
                    textTransform: 'none',
                    backgroundColor: 'purple',
                  }}
                >
                  Create Account
              </Button>
              <div style={{height: "2em"}}></div>
            <div style={{}}><span style={{color: '#7C7A7A', fontSize: 16, fontFamily: "'Josefin Sans', sans-serif", fontWeight: '500', wordWrap: 'break-word' }} >Already have an account? </span><button onClick= {navigatetologin} style= {{color: '#AF49FF', fontSize: 16, fontFamily: "'Josefin Sans', sans-serif", fontWeight: '500', wordWrap: 'break-word', cursor: 'pointer', border: 'none', background:'none'}} >Login</button></div>
            <div style={{height: "2em"}}></div>
        </div>
        <div style={{height: "2em"}}></div>
      </div>

      {/* </form> */}
      <ToastContainer />
    </div>
  );
}

export default Register;
