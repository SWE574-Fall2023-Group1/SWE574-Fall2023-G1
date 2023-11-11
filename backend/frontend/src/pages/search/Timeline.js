import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './Timeline.css';

const LocationSearch = () => {
  const [radiusDiff, setRadiusDiff] = useState(5);
  const [locationStories, setLocationStories] = useState([]);
  const [locationName, setLocationName] = useState('');
  const { locationJSON } = useParams();
  const navigate = useNavigate(); // Updated

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  useEffect(() => {
    const handleSearch = async () => {
      if (locationJSON) {
        try {
          const locationData = JSON.parse(locationJSON);
          setLocationName(determineLocationName(locationData)); // Update location name based on type

          const response = await axios.get(`http://${process.env.REACT_APP_BACKEND_HOST_NAME}:8000/user/storySearchByLocation`, {
            params: {
              location: locationJSON,
              radius_diff: radiusDiff,
            },
            withCredentials: true,
          });

          setLocationStories(response.data.stories);
        } catch (error) {
          console.error('Error fetching location stories:', error);
          setLocationStories([]);
        }
      }
    };

    handleSearch();
  }, [locationJSON, radiusDiff]);

  const determineLocationName = (locationData) => {
    switch (locationData.type) {
      case 'Point':
        return `Latitude: ${locationData.latitude}, Longitude: ${locationData.longitude}`;
      case 'LineString':
        return 'Line Location';
      case 'Polygon':
        return 'Polygon Location';
      case 'Circle':
        return `Circle Location with center at Latitude: ${locationData.center.lat}, Longitude: ${locationData.center.lng}`;
      default:
        return 'Unknown Location';
    }
  };

  const handleStoryClick = async (id) => {
    navigate(`/story/${id}`);
  };

  const handleGoBack = () => {
    navigate(-1); // This will navigate back to the previous page
  };
  const formatDate = (story) => {

    let dateString = "";
    const optionsWithoutTime = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    const dateOptions = story.include_time ? options : optionsWithoutTime;

    switch (story.date_type) {
      case "decade":
        dateString = `Memory Time: ${story.decade}s`;
        break;
      case "year":
        dateString = `Memory Time: ${story.year}`;
        break;
      case "year_interval":
        const startYear = story.start_year;
        const endYear = story.end_year;
        dateString = `Memory Time: ${startYear}-${endYear}`;
        break;
      case "normal_date":
        const date = new Date(story.date).toLocaleDateString("en-US", dateOptions);
        dateString = `Memory Time: ${date}`;
        break;
      case "interval_date":
        const startDate = new Date(story.start_date).toLocaleDateString("en-US", dateOptions);
        const endDate = new Date(story.end_date).toLocaleDateString("en-US", dateOptions);
        dateString = `Memory Time: ${startDate}-${endDate}`;
        break;
      default:
        dateString = "";
    }
    return dateString;
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
                  <p className="story-date-search">{formatDate(story)}</p> {/* Display the date */}
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
