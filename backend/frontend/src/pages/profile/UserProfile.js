import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';
import withAuth from '../../authCheck';
import { TextField, Button, Paper } from '@mui/material';
import addnewphoto from '../../assets/images/addnewphoto.png'
import deletephoto from '../../assets/images/deletephoto.png'
import tick from '../../assets/images/tick.png'
import edit from '../../assets/images/edit.png'


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
  const [inputValue, setInputValue] = useState('');

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

    } catch (error) {
      console.error('Error updating profile photo:', error);
    }
  };

  const handleRemoveProfilePhoto = async () => {
    try {
        console.log("Removing profile photo..."); // Add this line for debugging
        await axios.delete(`http://${process.env.REACT_APP_BACKEND_HOST_NAME}:8000/user/profilePhoto`, {
            withCredentials: true,
        });
        setProfilePhotoUrl(null);
        window.location.reload(); // Reload the page
    } catch (error) {
        console.error('Error removing profile photo:', error);
    }
};

const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};


  const handleKeyPress = (event) => {
    const { key, target } = event;

    // Check if the pressed key is Enter (Return)
    if (key === 'Enter') {
      // Prevent default behavior (new line)
      event.preventDefault();

      // Check if the content is non-empty
      const newValue = target.value + '\n';
      if (newValue.trim() === '\n') {
        return;
      }

      // Update the input value
      setInputValue(newValue);
    }
  }

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
        <div style={{left: 800, top: -270, position: 'absolute', color: '#262626', fontSize: 36, fontFamily: 'Roboto', fontWeight: '400', lineHeight: 25, wordWrap: 'break-word'}}>{user.username} <img src={tick}/></div>
      {profilePhotoUrl && (
        <img style={{left: 390, top: 120, position: 'absolute'}}
        src={profilePhotoUrl}
        alt={`${user.username}'s profile`}
        className="profile-photo"
        />
        )}



{profilePhotoUrl !== defaultProfilePhoto && (
  <div>


<div>
    <button
      type="button"
      className="profile-photo-change-button"
      onClick={() => document.getElementById('profile-photo-input').click()}
    >
     <div style={{left: 581, top: 170, position: 'absolute', color: '#111111', fontSize: 16, fontFamily: 'Roboto', fontWeight: '400', display: 'flex', justifyContent: 'center', alignItems: 'center', wordWrap: 'break-word'}}><img src={addnewphoto} style={{ marginRight: 6 }} alt="Add New Photo Icon"/>  Add new photo</div>
    </button>
    <span id="profile-photo-filename"></span>
    <input
      id="profile-photo-input"
      type="file"
      accept="image/jpeg, image/png"
      onChange={handleProfilePhotoChange}
    />
  </div>

  <div>
    <button
      type="button"
      className="profile-photo-delete-button"
      onClick={handleRemoveProfilePhoto}
    >
     <div style={{left: 583, top: 202, position: 'absolute', color: '#111111', fontSize: 16, fontFamily: 'Roboto', fontWeight: '400', display: 'flex', justifyContent: 'center', alignItems: 'center', wordWrap: 'break-word'}}><img src={deletephoto} style={{ marginRight: 7 }} alt="Delete Photo Icon"/> Delete photo</div>
    </button>
    </div>
  </div>
)}

{profilePhotoUrl === defaultProfilePhoto && (

  <div>
    <button
      type="button"
      className="profile-photo-change-button"
      onClick={() => document.getElementById('profile-photo-input').click()}
    >
     <div style={{left: 581, top: 172, position: 'absolute', color: '#111111', fontSize: 16, fontFamily: 'Roboto', fontWeight: '400', display: 'flex', justifyContent: 'center', alignItems: 'center', wordWrap: 'break-word'}}><img src={addnewphoto} style={{ marginRight: 6 }} alt="Add New Photo Icon"/> Add new photo</div>
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
            onKeyPress={handleKeyPress}
            onChange={(e) => setUpdatedBio(e.target.value)}
            multiline={true}
            inputProps={{ maxLength: 300, rows: 3 }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.shiftKey) {
                e.preventDefault();
                setUpdatedBio((prev) => prev + '\n');
              }
            }}
            InputProps={{ className: 'edit-box' }}
            />
            </div>
            <div>
            <Button variant="contained" style={{top:100}} color='success' type="button" onClick={handleProfileBioChange}>Save</Button>
            <Button variant="contained" style={{top:100}} type="button" onClick={() => setIsEditingBio(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <div>
            <div style={{height: 30, left: 321, top: 300, position: 'absolute', color: '#2C2A2A', fontSize: 20, fontFamily: 'Inter', fontWeight: '700', wordWrap: 'break-word'}}>About Me</div>
            <br/>
            <div className="custom-bio" style={{width: 750, height: 100, left: 300, top: 330, borderRadius: 14, position: 'absolute', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', justifyContent: 'left', alignItems: 'left', display: 'inline-flex'}}>
              <div>{user.biography.split('\n').map((line, index) => <span key={index}>{capitalizeFirstLetter(line)}<br/></span>)}</div>
            </div>
            <button type="button" className="edit-buttons"  onClick={() => setIsEditingBio(true)} style={{position: 'relative'}}><div style={{position: 'absolute',left: 320, top: 245, display: 'flex', justifyContent: 'center', alignItems: 'center', textTransform: 'none', background:'none'}}><img src={edit} style={{ marginRight: 5 }} alt="Edit Icon"/>Edit</div></button>
          </div>
        )}
        <br/>
      <div className="custom-followers" style={{left: 587, top: 125, position: 'absolute', color: '#111111', fontSize: 18, fontFamily: 'Roboto', fontWeight: '400', wordWrap: 'break-word'}}><p>{user.followers.length !== null ? user.followers.length : 'Loading...'} followers</p>
          </div>

          <div style={{height: 30, left: 321, top: 450, position: 'absolute', color: '#2C2A2A', fontSize: 20, fontFamily: 'Inter', fontWeight: '700', wordWrap: 'break-word'}}>My Recent Stories</div>
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
  );
};


export default withAuth(UserProfile);
