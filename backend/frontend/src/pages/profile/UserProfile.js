import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';
import withAuth from '../../authCheck';
import { TextField, Button, Paper } from '@mui/material';


const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(null);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [updatedBio, setUpdatedBio] = useState(null);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [defaultProfilePhoto] = useState('https://i.stack.imgur.com/l60Hf.png');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const fetchedUser = await fetchUserDetails();
      fetchProfilePhoto();
      fetchUserStories(fetchedUser);
    };
    fetchData();
  }, [currentPage]);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`http://${process.env.REACT_APP_BACKEND_HOST_NAME}:8000/user/userDetails`, {
        headers: {
        },
        withCredentials: true,
      });
      setUser(response.data);
      setUpdatedBio(response.data.biography);
      return response.data;
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const fetchProfilePhoto = async () => {
    try {
      const response = await axios.get(`http://${process.env.REACT_APP_BACKEND_HOST_NAME}:8000/user/profilePhoto`, {
        headers: {},
        withCredentials: true,
      });


      // Directly set the URL from the response to state
      setProfilePhotoUrl(response.data.photo_url);

    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Profile photo not found, set the default photo
        setProfilePhotoUrl(defaultProfilePhoto);
      } else {
        console.error('Error fetching profile photo:', error);
      }
    }
  };
  console.log(profilePhotoUrl)

  const fetchUserStories = async (user) => {

    try {
      const response = await axios.get(`http://${process.env.REACT_APP_BACKEND_HOST_NAME}:8000/user/userStories/${user.id}?page=${currentPage}&size=5`, {
        withCredentials: true,
      });
      console.log(response.data)
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

  const handleProfilePhotoChange = async (event) => {
    event.preventDefault(); // Prevent the default behavior of the file input

    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profile_photo', file);

    try {
      await axios.put(`http://${process.env.REACT_APP_BACKEND_HOST_NAME}:8000/user/profilePhoto`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      await fetchProfilePhoto(); // Wait for the photo to be updated
      window.location.reload(); // Reload the page

    } catch (error) {
      console.error('Error updating profile photo:', error);
    }
  };

  const handleRemoveProfilePhoto = async () => {
    try {
      await axios.delete(`http://${process.env.REACT_APP_BACKEND_HOST_NAME}:8000/user/profilePhoto`, {
        withCredentials: true,
      });
      setProfilePhotoUrl(null);
      window.location.reload(); // Reload the page
    } catch (error) {
      console.error('Error removing profile photo:', error);
    }
  };

  const handleProfileBioChange = async () => {
    try {
      await axios.put(`http://${process.env.REACT_APP_BACKEND_HOST_NAME}:8000/user/biography`, { biography: updatedBio }, {
        withCredentials: true,
      });
      setUser({ ...user, biography: updatedBio });
      setIsEditingBio(false);
    } catch (error) {
      console.error('Error updating biography:', error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{user.username}'s Profile</h1>

      {profilePhotoUrl && (
        <img
        src={profilePhotoUrl}
        alt={`${user.username}'s profile`}
        className="profile-photo"
        />
        )}



{profilePhotoUrl !== defaultProfilePhoto && (
  <div>

    <button
      type="button"
      className="profile-photo-delete-button"
      onClick={handleRemoveProfilePhoto}
    >
      Remove Profile Photo
    </button>
  </div>
)}

{profilePhotoUrl === defaultProfilePhoto && (
  <div>
    <button
      type="button"
      className="profile-photo-button"
      onClick={() => document.getElementById('profile-photo-input').click()}
    >
      Upload Profile Photo
    </button>
    <span id="profile-photo-filename"></span>
    <input
      id="profile-photo-input"
      type="file"
      accept="image/jpeg, image/png"
      onChange={handleProfilePhotoChange}
    />
  </div>
)}

      {isEditingBio ? (
          <div>
          <div className='edit-box'>
            <TextField
            value={updatedBio}
            onChange={(e) => setUpdatedBio(e.target.value)}
            multiline={true}
            rowsMax={100}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.shiftKey) {
                e.preventDefault();
                setUpdatedBio((prev) => prev + '\n');
              }
            }}
            InputProps={{ className: 'edit-box' }}
            />
            </div>
            <div className='edit-buttons'>
            <Button variant="contained" color='success' type="button" onClick={handleProfileBioChange}>Save</Button>
            <Button variant="contained" type="button" onClick={() => setIsEditingBio(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <div>
            <br/>
            <Paper elevation={3} className="custom-bio">
            <strong>Biography</strong>
            <p>{user.biography.split('\n').map((line, index) => <span key={index}>{line}<br/></span>)}</p>
            </Paper>
            <Button variant="contained" type="button" onClick={() => setIsEditingBio(true)}>Edit</Button>
          </div>
        )}
        <br/>
      <Paper elevation={3} className="custom-followers">
            <strong>Followers</strong>
            <p>{user.followers.length !== null ? user.followers.length : 'Loading...'}</p>
          </Paper>

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
  );
};


export default withAuth(UserProfile);
