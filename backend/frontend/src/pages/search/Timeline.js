import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const LocationSearch = () => {
  const [radiusDiff, setRadiusDiff] = useState(25);
  const [locationStories, setLocationStories] = useState([]);
  const { locationJSON } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleSearch = async () => {
      if (locationJSON) { // Checking if all necessary parameters are available
        try {
          const response = await axios.get(`http://${process.env.REACT_APP_BACKEND_HOST_NAME}:8000/user/storySearchByLocation/`, {
            params: {
              location: locationJSON, // Updated location objec
              radius_diff: radiusDiff,
            },
            withCredentials: true,
          });
      console.log("oguz", location)

          setLocationStories(response.data.stories);
        } catch (error) {
          console.error('Error fetching location stories:', error);
          setLocationStories([]);
        }
      }
    };

    handleSearch();
  }, [name, latitude, longitude, radiusDiff]);

  const handleStoryClick = async (id) => {
    navigate(`/story/${id}`);
  };

  return (
    <div>
      <h2>Location Search</h2>

      {locationStories.length > 0 && (
        <>
          <h3>Location Search Results:</h3>
          <div>
            {locationStories.map(story => (
              <div key={story.id} className="story-box-search">
                <div className="story-details-search">
                  <h3 className="story-title-search" onClick={() => handleStoryClick(story.id)}>{story.title}</h3>
                  <p className="story-author-search">by {story.author_username || 'Unknown'}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LocationSearch;
