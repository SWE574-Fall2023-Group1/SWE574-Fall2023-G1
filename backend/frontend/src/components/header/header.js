import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import "./header.css";
import axios from "axios";
import UserSearch from "./UserSearch";
import Register from "../../pages/landing/Register";
import Login from "../../pages/landing/Login";
import CreateStory from "../../pages/story/CreateStory";
import EditStory from "../../pages/story/EditStory";
import StoryContainer from "../../pages/homepage/StoryContainer";
import StoryDetails from "../../pages/story/StoryDetails";
import LogoutButton from "../../pages/landing/Logout";
import UserProfile from "../../pages/profile/UserProfile";
import UserProfileOthers from "../../pages/profile/UserProfileOthers";
import { LoadScriptNext } from "@react-google-maps/api";
import SearchUserResults from "../../pages/search/SearchUserResults";
import StorySearch from "../../pages/search/StorySearch";
import mainPhoto from "../../assets/images/homePage4.png";
import ResetPasswordRequest from "../../pages/landing/ResetPasswordRequest";
import ResetPasswordMain from "../../pages/landing/ResetPasswordMain";
import LocationSearch from "../../pages/search/Timeline";
import SearchResults from "../../pages/search/SearchResults";
import ActivityStream from "../../pages/activity/ActivityStream";
import Recommendations from "../../pages/recom/Recommendations";
import Button from '@mui/material/Button'

function Header({ toggleTheme, currentTheme }) {
  console.log("Rendering Header");

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //const isLoggedIn = withAuth();

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(
        `http://${process.env.REACT_APP_BACKEND_HOST_NAME}:8000/user/user`,
        { withCredentials: true }
      );
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
        <nav className="navbar" style={{ backgroundColor: currentTheme === 'custom' ? '#3a3a3a' : '#8E8A8A' }}>>
            {!isLoggedIn && (
              <>
                <Link to="/" className="nav-item nav-link">
                  Home
                </Link>
                <Link to="/register" className="nav-item nav-link">
                  Register
                </Link>
                <Link to="/login" className="nav-item nav-link">
                  Login
                </Link>
                <Button style={{ marginRight: "25px", backgroundColor: currentTheme === 'custom' ? 'orange' : 'purple', color: currentTheme === 'custom' ? '#ffffff' : '#000000' }} onClick={toggleTheme}> {currentTheme === 'custom' ? 'Light Mode' : 'Dark Mode'} </Button>
              </>
            )}
            {isLoggedIn && (
              <>
                <Link to="/homepage" className="nav-item nav-link">
                  <img
                    src={mainPhoto}
                    alt="Home Page"
                    style={{ width: "100px"}}
                  />
                </Link>
                <Link to="/story_search" className="nav-item nav-link">
                  Search Memories
                </Link>
                <Link to="/create-story" className="nav-item nav-link">
                  Create Memory
                </Link>
                <Link to="/user-profile" className="nav-item nav-link">
                  Profile
                </Link>
                <Link to="/activity-stream" className="nav-item nav-link">
                  Activity Stream
                </Link>
                <Link to="/recommendation" className="nav-item nav-link">
                  Recommendations
                </Link>
                <Button style={{ marginRight: "25px", backgroundColor: currentTheme === 'custom' ? 'orange' : 'purple', color: currentTheme === 'custom' ? '#ffffff' : '#000000' }} onClick={toggleTheme}> {currentTheme === 'custom' ? 'Light Mode' : 'Dark Mode'} </Button>
                <UserSearch />
                <LogoutButton />
              </>
            )}
        </nav>
        <LoadScriptNext
          googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
          libraries={["places", "drawing"]}
        >
          <Routes>
            {!isLoggedIn && (
              <>
                <Route path="*" element={<Navigate to="/" />} />
                <Route
                  path="/"
                  element={
                    <div className="home-container">
                      <img
                        src={mainPhoto}
                        alt="Memories"
                        style={{ width: "1000px", height: "auto", maxWidth : "100%" }}
                      />
                    </div>
                  }
                />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/login"
                  element={<Login onLoginSuccess={() => setIsLoggedIn(true)} />}
                />
                <Route
                  path="/resetPassword"
                  element={<ResetPasswordRequest />}
                />
                <Route
                  path="/resetPassword/:token/:uidb64"
                  element={<ResetPasswordMain />}
                />
              </>
            )}

            {isLoggedIn && (
              <>
                <Route path="*" element={<Navigate to="/homepage" currentTheme={currentTheme}/>} />
                <Route path="/homepage" element={<StoryContainer currentTheme={currentTheme}/>} />
                <Route path="/create-story" element={<CreateStory currentTheme={currentTheme}/>} />
                <Route path="/story/:id" element={<StoryDetails currentTheme={currentTheme}/>} />
                <Route path="/user-profile" element={<UserProfile currentTheme={currentTheme}/>} />
                <Route
                  path="/user-profile/:id"
                  element={<UserProfileOthers currentTheme={currentTheme}/>}
                />
                <Route
                  path="/SearchUserResults/:searchQuery"
                  element={<SearchUserResults currentTheme={currentTheme}/>}
                />
                <Route path="/story_search" element={<StorySearch currentTheme={currentTheme}/>} />
                <Route
                  path="/timeline"
                  element={<LocationSearch currentTheme={currentTheme}/>}
                />
                <Route
                  path="/search-results"
                  element={<SearchResults currentTheme={currentTheme}/>}
                />
                <Route path="/edit-story/:storyId" element={<EditStory currentTheme={currentTheme}/>} />
                <Route path="/activity-stream" element={<ActivityStream currentTheme={currentTheme}/>} />
                <Route path="/recommendation" element={<Recommendations currentTheme={currentTheme}/>} />
              </>
            )}
          </Routes>
        </LoadScriptNext>
      </div>
    </Router>
  );
}

export default Header;
