import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function ResetPasswordMain() {
  const [newPassword, setNewPassword] = useState('');
  const { uidb64, token } = useParams();
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`http://${process.env.REACT_APP_BACKEND_HOST_NAME}:8000/user/passwordReset/${token}/${uidb64}`, {
      new_password: newPassword,
    }).then(response => {
      toast.success('Password has been reset.');
      navigate('/login');
    }).catch(error => {
      console.log(error.response.data);
    });
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h1>Enter New Password</h1>
        <div className="form-group">
          <label>New Password:</label>
          <input type="password" className="form-control" onChange={(e) => setNewPassword(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
        <ToastContainer position="bottom-right" />
      </form>
    </div>
  );
}

export default ResetPasswordMain;
