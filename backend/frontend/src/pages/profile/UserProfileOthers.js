import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams,useNavigate } from 'react-router-dom';
import './UserProfile.css';
import withAuth from '../../authCheck';
import UserProfile from './UserProfile';
import './UserProfileOthers.css';
import { Button, Paper } from '@mui/material';
import tick from '../../assets/images/tick.png'



const UserProfileOthers = () => {
  const [user, setUser] = useState(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(null);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isMe, setIsMe] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const { id } = useParams();
  const [defaultProfilePhoto] = useState('https://i.stack.imgur.com/l60Hf.png');


  const navigate = useNavigate();

  const getCurrentUser = async () => {
    try {
      const response = await axios.get(`http://${process.env.REACT_APP_BACKEND_HOST_NAME}:8000/user/user`, {
        headers: {},
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {

        const currentUser = await getCurrentUser();
        if (Number(id) === currentUser.user_id) {
          setIsMe(true);
        }

        const userDetailsResponse = await axios.get(`http://${process.env.REACT_APP_BACKEND_HOST_NAME}:8000/user/userDetails/${id}`, {
          headers: {},
          withCredentials: true,
        });
        setUser(userDetailsResponse.data);
        console.log('User details response:', userDetailsResponse.data);

        try {
          const profilePhotoResponse = await axios.get(`http://${process.env.REACT_APP_BACKEND_HOST_NAME}:8000/user/profilePhoto/${id}`, {
            headers: {},
            withCredentials: true,
          });

          // Directly set the URL from the response to state
          setProfilePhotoUrl(profilePhotoResponse.data.photo_url);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            // Profile photo not found, you might want to set the default photo here
            setProfilePhotoUrl(defaultProfilePhoto);
          } else {
            console.error('Error fetching profile photo:', error);
          }
        }

        const followersResponse = await axios.get(`http://${process.env.REACT_APP_BACKEND_HOST_NAME}:8000/user/userFollowers/${id}`, {
          headers: {},
          withCredentials: true,
        });
        console.log('Followers response:', followersResponse.data);

        const isCurrentUserFollowing = followersResponse.data.some(
            (follower) => follower.id === currentUser.user_id
        );

        setIsFollowing(isCurrentUserFollowing);

        setFollowerCount(followersResponse.data.length);
        setLoading(false);

      } catch (error) {
        console.error('Error fetching user details and profile photo:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);


  useEffect(() => {
    fetchUserStories();
  }, [currentPage]);

  const handleFollowClick = async () => {
    try {
      const response = await axios.post(`http://${process.env.REACT_APP_BACKEND_HOST_NAME}:8000/user/followByUser/${id}`, null, {
        headers: {},
        withCredentials: true,
      });
      if (response.data.msg === 'Followed') {
        setFollowerCount(followerCount + 1);
        setIsFollowing(true);
      } else {
        setFollowerCount(followerCount - 1);
        setIsFollowing(false);
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };

  const fetchUserStories = async () => {
    try {
      const response = await axios.get(`http://${process.env.REACT_APP_BACKEND_HOST_NAME}:8000/user/userStories/${id}?page=${currentPage}&size=5`, {
        withCredentials: true,
      });
      setStories(response.data.stories);
      setHasNextPage(response.data.has_next);
      setHasPrevPage(response.data.has_prev);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error('Error fetching user stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStoryClick = async (id) => {
    navigate(`/story/${id}`);
  }

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {isMe? <UserProfile/>:
          <div> <div style={{left: 800, top: -270, position: 'absolute', color: '#262626', fontSize: 36, fontFamily: 'Roboto', fontWeight: '400', lineHeight: 25, wordWrap: 'break-word'}}>{user.username} <img src={tick}/></div>
      {profilePhotoUrl && (
        <img style={{left: 390, top: 120, position: 'absolute'}}
        src={profilePhotoUrl}
        alt={`${user.username}'s profile`}
        className="profile-photo"
            />
          )}
          {/* <p>ID: {user.id}</p>
          <p>Email: {user.email}</p> */}
          <div>
            <div style={{height: 30, left: 321, top: 300, position: 'absolute', color: '#2C2A2A', fontSize: 20, fontFamily: 'Inter', fontWeight: '700', wordWrap: 'break-word'}}>About Me</div>
            <br/>
            <div className="custom-bio" style={{width: 750, height: 100, left: 300, top: 330, borderRadius: 14, position: 'absolute', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', justifyContent: 'left', alignItems: 'left', display: 'inline-flex'}}>
              <div>{user.biography.split('\n').map((line, index) => <span key={index}>{capitalizeFirstLetter(line)}<br/></span>)}</div>
            </div>
          </div>


          <div style={{left: 587, top: 125, position: 'absolute', color: '#111111', fontSize: 18, fontFamily: 'Roboto', fontWeight: '400', wordWrap: 'break-word'}}><p>{user.followers.length !== null ? user.followers.length : 'Loading...'} followers</p>
          </div>
          <button type="button" className="custom-followers" style={{left: 590, top: 170, position: 'absolute', fontSize: 16, fontFamily: 'Roboto', fontWeight: '400', display: 'flex', justifyContent: 'center', alignItems: 'center', wordWrap: 'break-word'}} onClick={handleFollowClick}>
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>


          <div style={{height: 30, left: 321, top: 450, position: 'absolute', color: '#2C2A2A', fontSize: 20, fontFamily: 'Inter', fontWeight: '700', wordWrap: 'break-word'}}>Recent Stories</div>
          {loading ? (
            <div style={{ marginTop:400}}>
              <p>Loading stories...</p>
            </div>
          ) : stories.length === 0 ? (
            <div style={{ marginTop:400}}>
              <p>No stories found.</p>
            </div>
          ) : (
            <div>
              {stories.map(story => (
                <div key={story.id} className="story-box" style={{width: 780}}>
                  <div className="story-details">
                    <h3 className="story-title" onClick={() => handleStoryClick(story.id)}>{story.title}</h3>
                    <p className="story-author">Posted on {new Date(story.creation_date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
              <div className="pagination">
                <Button variant="contained" onClick={() => handlePageChange(currentPage - 1)} disabled={!hasPrevPage}>
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, index) => (
                  <Button variant="contained"
                    key={index}
                    className={index + 1 === currentPage ? 'active' : null}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </Button>
                ))}
                <Button variant="contained" onClick={() => handlePageChange(currentPage + 1)} disabled={!hasNextPage}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
        }
    </div>
  );
};


export default withAuth(UserProfileOthers);
