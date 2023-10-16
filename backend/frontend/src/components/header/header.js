import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './header.css';
import axios from 'axios';
import UserSearch from './UserSearch';
import Register from '../../pages/landing/Register';
import Login from '../../pages/landing/Login';
import CreateStory from '../../pages/story/CreateStory';
import StoryContainer from '../../pages/homepage/StoryContainer';
import StoryDetails from '../../pages/story/StoryDetails';
import LogoutButton from '../../pages/landing/Logout';
import UserProfile from '../../pages/profile/UserProfile';
import UserProfileOthers from '../../pages/profile/UserProfileOthers';
import { LoadScriptNext } from "@react-google-maps/api";
import SearchUserResults from '../../pages/search/SearchUserResults';
import StorySearch from '../../pages/search/StorySearch';
import mainPhoto from '../../assets/images/homePage4.png'
import ResetPasswordRequest from '../../pages/landing/ResetPasswordRequest';
import ResetPasswordMain from '../../pages/landing/ResetPasswordMain';


function Header() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //const isLoggedIn = withAuth();
  
  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`http://${process.env.REACT_APP_BACKEND_HOST_NAME}:8000/user/user`, { withCredentials: true });
      if (response && response.data) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <Router>
      <div className="container">
        <nav className="navbar">
          <div className="navbar-nav">
            {!isLoggedIn && (
              <>
                <Link to="/" className="nav-item nav-link">Home</Link>
                <Link to="/register" className="nav-item nav-link">Register</Link>
                <Link to="/login" className="nav-item nav-link">Login</Link>
              </>
            )}
            {isLoggedIn && (
              <>
                <Link to="/homepage" className="nav-item nav-link"><img
                  src={mainPhoto}
                  alt="Home Page"
                  style={{ width: '50px', height: '50px' }}
                /></Link>
                <Link to="/story_search" className="nav-item nav-link">Search Stories</Link>
                <Link to="/create-story" className="nav-item nav-link">Create Story</Link>
                <Link to="/user-profile" className="nav-item nav-link">User Profile</Link>
                <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginLeft: '40vw' }}>
                  <UserSearch />
                  <LogoutButton />
                </div>
                </>
              </>
            )}
          </div>
        </nav>
        <LoadScriptNext googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} libraries={['places']}>
          <Routes>
          {!isLoggedIn && (
              <>
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/" element={
                  <div className="home-container">
                    <img
                      src={mainPhoto}
                      alt="Memories"
                      style={{ width: '1000px', height: 'auto' }}
                    />
                  </div>
                } />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login onLoginSuccess={() => setIsLoggedIn(true)} />} />
            <Route path="/resetPassword" element={<ResetPasswordRequest />} />
            <Route path="/resetPassword/:token/:uidb64" element={<ResetPasswordMain />} />
            </>
            )}
            
            {isLoggedIn && (
              <>
            <Route path="*" element={<Navigate to="/homepage" />} />
            <Route path="/homepage" element={<StoryContainer />} />
            <Route path="/create-story" element={<CreateStory />} />
            <Route path="/story/:id" element={<StoryDetails />} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/user-profile/:id" element={<UserProfileOthers />} />
            <Route path="/SearchUserResults/:searchQuery" element={<SearchUserResults />} />
            <Route path="/story_search" element={<StorySearch />} />
            </>
            )}
          </Routes>
        </LoadScriptNext>
      </div>
    </Router>
  );
}

export default Header;