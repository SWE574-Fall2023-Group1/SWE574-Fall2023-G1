import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './StoriesByFollowingsUsers.module.css';
import withAuth from '../../authCheck';
import { Button } from '@mui/material';


function StoriesByFollowingsUsers() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [profilePhotos, setProfilePhotos] = useState({});
  const [loadingProfilePhotos, setLoadingProfilePhotos] = useState({});
  const [defaultProfilePhoto] = useState('https://i.stack.imgur.com/l60Hf.png');



  const navigate = useNavigate();

  const fetchProfilePhoto = async (userId) => {
    if (loadingProfilePhotos[userId]) {
      return;
    }

    setLoadingProfilePhotos((prevState) => ({
      ...prevState,
      [userId]: true,
    }));

    try {
      const profilePhotoResponse = await axios.get(`http://${process.env.REACT_APP_BACKEND_HOST_NAME}:8000/user/profilePhoto/${userId}`, {
        headers: {},
        withCredentials: true,
      });

      // Just return the photo_url
      return profilePhotoResponse.data.photo_url;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return defaultProfilePhoto;
      } else {
        console.error('Error fetching profile photo:', error);
      }
    } finally {
      setLoadingProfilePhotos((prevState) => {
        const newState = { ...prevState };
        delete newState[userId];
        return newState;
      });
    }
};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storiesResponse = await axios.get(`http://${process.env.REACT_APP_BACKEND_HOST_NAME}:8000/user/userStories?page=${currentPage}&size=10`, { withCredentials: true });
        setStories(storiesResponse.data.stories);
        setHasNextPage(storiesResponse.data.has_next);
        setHasPrevPage(storiesResponse.data.has_prev);
        setTotalPages(storiesResponse.data.total_pages);

        const newProfilePhotos = { ...profilePhotos };
        for (const story of storiesResponse.data.stories) {
          if (!newProfilePhotos[story.author]) {
            newProfilePhotos[story.author] = await fetchProfilePhoto(story.author);
          }
        }
        setProfilePhotos(newProfilePhotos);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage]);

  const handleStoryClick = async (id) => {
    navigate(`/story/${id}`);
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };


  const handlePhotoClick = async (userId) => {
    navigate(`/user-profile/${userId}`);
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        stories.map(story => (
          <div key={story.id} className={styles.storyBox}>
            <img
              className={styles.storyAuthorPhoto}
              src={profilePhotos[story.author]}
              alt={`${story.author_username || 'Unknown'}'s profile`}
              onClick={() => handlePhotoClick(story.author)}
            />
            <div className={styles.storyDetails}>
              <h3 className={styles.storyTitle} onClick={() => handleStoryClick(story.id)}>{story.title}</h3>
              <p className={styles.storyAuthor}>by {story.author_username || 'Unknown'}</p>
            </div>
          </div>
        ))
      )}
      <div className={styles.pagination}>
        <Button variant="contained" onClick={() => handlePageChange(currentPage - 1)} disabled={!hasPrevPage}>
          Previous
        </Button>
        {Array.from({ length: totalPages }, (_, index) => (
          <Button variant="contained"
            key={index}
            className={index + 1 === currentPage ? styles.active : null}
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
  );
}

export default withAuth(StoriesByFollowingsUsers);
