import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './Timeline.css';

const LocationSearch = () => {
  const [radiusDiff, setRadiusDiff] = useState(25);
  const [locationStories, setLocationStories] = useState([]);
  const [locationName, setLocationName] = useState('');
  const { locationJSON } = useParams();
  const navigate = useNavigate(); // Updated

  useEffect(() => {
    const handleSearch = async () => {
      if (locationJSON) {
        try {
          const response = await axios.get(`http://${process.env.REACT_APP_BACKEND_HOST_NAME}:8000/user/storySearchByLocation`, {
            params: {
              location: locationJSON,
              radius_diff: radiusDiff,
            },
            withCredentials: true,
          });

          setLocationStories(response.data.stories);

          const locationData = JSON.parse(locationJSON);
          setLocationName(locationData.name);

        } catch (error) {
          console.error('Error fetching location stories:', error);
          setLocationStories([]);
        }
      }
    };

    handleSearch();
  }, [locationJSON, radiusDiff]);

  const handleStoryClick = async (id) => {
    window.location.href = `/story/${id}`;
  };

  const handleGoBack = () => {
    navigate(-1); // This will navigate back to the previous page
  };

  return (
    <div>
      <h2>Memories in {locationName}</h2>

      {locationStories.length > 0 ? (
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
          <button onClick={handleGoBack}>Go Back</button>
        </>
      ) : (
        <div>
          <h1>Sorry, there are no stories on this location.</h1>
          <h2>Try a different one.</h2>
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
