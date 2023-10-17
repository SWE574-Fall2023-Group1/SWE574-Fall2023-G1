import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams,useNavigate } from 'react-router-dom';
import './UserProfile.css';
import withAuth from '../../authCheck';
import UserProfile from './UserProfile';
import './UserProfileOthers.css';
import { Button, Paper } from '@mui/material';


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

        if (Number(id) === currentUser) {
          setIsMe(true);
          //navigate('/user-profile');
          //return;
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
            responseType: 'arraybuffer',
          });
          const base64Image = Buffer.from(profilePhotoResponse.data, 'binary').toString('base64');

          const contentType = profilePhotoResponse.headers['content-type'];
          const dataUrlPrefix = contentType === 'image/jpeg' ? 'data:image/jpeg;base64,' : 'data:image/png;base64,';

          setProfilePhotoUrl(`${dataUrlPrefix}${base64Image}`);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            // Profile photo not found, do nothing
          } else {
            console.error('Error fetching profile photo:', error);
          }
        }

        const followersResponse = await axios.get(`http://${process.env.REACT_APP_BACKEND_HOST_NAME}:8000/user/userFollowers/${id}`, {
        headers: {},
        withCredentials: true,
        });
        console.log('Followers response:', followersResponse.data);

        console.log(followersResponse.data)
        const isCurrentUserFollowing = followersResponse.data.some(
            (follower) => follower.id === currentUser
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
      if (response.data === "followed") {
        setIsFollowing(true);
        setFollowerCount((prevCount) => prevCount + 1);
      } else if (response.data === "unfollowed") {
        setIsFollowing(false);
        setFollowerCount((prevCount) => prevCount - 1);
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
          <div>
          <h1>{user.username}'s Profile</h1>
          {profilePhotoUrl && (
            <img
              src={profilePhotoUrl}
              alt={`${user.username}'s profile`}
              className="profile-photo"
            />
          )}
          {/* <p>ID: {user.id}</p>
          <p>Email: {user.email}</p> */}
          <Paper elevation={3} className="custom-bio">
            <strong>Biography</strong>
            <p>{user.biography}</p>
            </Paper>
          <Paper elevation={3} className="custom-followers">
            <strong>Followers</strong>
            <p>{followerCount !== null ? followerCount : 'Loading...'}</p>
          </Paper>
          <Button variant="contained" onClick={handleFollowClick}>
            {isFollowing ? 'Unfollow' : 'Follow'}
          </Button>
          <h2>Stories</h2>
          {loading ? (
            <p>Loading stories...</p>
          ) : stories.length === 0 ? (
            <p>No stories found.</p>
          ) : (
            <div>
              {stories.map(story => (
                <div key={story.id} className="story-box">
                  <div className="story-details">
                    <h3 className="story-title" onClick={() => handleStoryClick(story.id)}>{story.title}</h3>
                    <p className="story-author">Creation Date: {new Date(story.creation_date).toLocaleDateString()}</p>
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
