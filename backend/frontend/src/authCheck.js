import React, { useEffect, useState } from 'react';
import axios from 'axios';

async function checkAuth(setShowLoginMessage) {
    try {
      const response = await axios.get(`http://${process.env.REACT_APP_BACKEND_HOST_NAME}:8000/user/user`, { withCredentials: true });
      //console.log(response)
      const { is_authenticated } = response.data;
      //console.log(is_authenticated)
      if (is_authenticated === false) {
        setShowLoginMessage(true);
      }
    } catch (error) {
      setShowLoginMessage(true);
    }
  }


export default function withAuth(WrappedComponent) {
  return function AuthComponent(props) {
    const [showLoginMessage, setShowLoginMessage] = useState(false);

    useEffect(() => {
        checkAuth(setShowLoginMessage);
      }, []);

    return (
      <>
        {showLoginMessage && (
          <div style={{ color: 'red' }}>YOU NEED TO LOG IN</div>
        )}
        {!showLoginMessage && <WrappedComponent {...props} />}
      </>
    );
  };
}
