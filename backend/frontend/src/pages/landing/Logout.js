import React from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';

function LogoutButton() {
  const handleLogoutClick = async () => {
    try {
      const response = await axios.post(`http://${process.env.REACT_APP_BACKEND_HOST_NAME}:8000/user/logout`,{}, { withCredentials: true });
      if (response.data.success === true) {
        // Redirect to the home page or the login page after successful logout
        localStorage.setItem('token', '');
        window.location.href = '/';
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Button variant="contained" color="error" style={{ position: 'absolute', top: '10px', right: '10px' }} onClick={handleLogoutClick}>Logout</Button>
  );
}

export default LogoutButton;
