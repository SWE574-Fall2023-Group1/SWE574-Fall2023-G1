import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

function ResetPasswordRequest() {
  const [email, setEmail] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  // const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`http://${process.env.REACT_APP_BACKEND_HOST_NAME}:8000/user/passwordReset`, {
      email: email,
    }).then(response => {
      toast.success('Password reset email sent.');
      setShowMessage(true);
    }).catch(error => {
      console.log(error.response.data);
    });
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h1>Reset Password</h1>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email" // Add an id to the input
              className="form-control"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        <button type="submit" className="btn btn-primary">Send Code</button>
        {showMessage && (
          <p className="mt-3">Open the link in your mail</p>
        )}
        <ToastContainer position="bottom-right" />
      </form>
    </div>
  );
}

export default ResetPasswordRequest;
