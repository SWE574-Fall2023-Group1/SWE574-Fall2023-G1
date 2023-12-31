import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './Timeline.css';
import StoryDetailsBox from './StoryDetailsBox';

const LocationSearch = ({ currentTheme }) => {

  const [locationName, setLocationName] = useState('');
  const [locationStories, setLocationStories] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [isDescOrder, setIsDescOrder] = useState(true); // Default to true for descending order


  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  useEffect(() => {
    if (location.state && location.state.stories) {
      setLocationStories(location.state.stories);
      // Check if search parameters are available
      if (location.state.searchParams) {
        const params = location.state.searchParams;
        // Display search parameters
        // Example: setTitleSearch(params.title);
        // You can store these in state or directly display them
      }
    } else {
      // Handle the case when no stories or parameters are passed
    }
  }, [location.state]);

  const toggleOrder = () => {
    setLocationStories(prevStories => [...prevStories].reverse());
    setIsDescOrder(prevOrder => !prevOrder);
  };

  const handleStoryClick = async (id) => {
    navigate(`/story/${id}`);
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

  const extractFirstImageUrl = (htmlContent) => {
    const imgRegex = /<img.*?src=["'](.*?)["']/;
    const match = htmlContent.match(imgRegex);
    return match ? match[1] : null;
  };
  console.log("params",location.state.searchParams)

  const renderSearchParams = (params) => {
    return (
      <div className="search-params">
        {params.title && <p style={{ color: currentTheme === 'custom' ? '#ffffff' : '#000000' }}><b>Title: </b>{params.title}</p>}
        {params.author && <p style={{ color: currentTheme === 'custom' ? '#ffffff' : '#000000' }}><b>Author: </b>{params.author}</p>}
        {params.tag && <p style={{ color: currentTheme === 'custom' ? '#ffffff' : '#000000' }}><b>Tag: </b>{params.tag}</p>}
        {params.tag_label && <p style={{ color: currentTheme === 'custom' ? '#ffffff' : '#000000' }}><b>Tag Label: </b>{params.tag_label}</p>}
        {params.location && <p style={{ color: currentTheme === 'custom' ? '#ffffff' : '#000000' }}><b>Location: </b>{params.location}</p>}
        {params.time_value && <p style={{ color: currentTheme === 'custom' ? '#ffffff' : '#000000' }}><b>Time Period: </b>{params.time_value}</p>}
        {/* Render other search parameters as needed */}
      </div>
    );
  };

  return (
    <div>
      <h2 style={{ color: currentTheme === 'custom' ? '#ffffff' : '#000000' }}>Timeline of Memories</h2>
      {location.state && location.state.searchParams && renderSearchParams(location.state.searchParams)}
      <div style={{height: "2em"}}></div>
      <label className="switch">
        <input type="checkbox" checked={!isDescOrder} onChange={toggleOrder} />
        <span className="slider round"></span>
      </label>
      <span style={{ color: currentTheme === 'custom' ? '#ffffff' : '#000000', marginLeft: '10px', verticalAlign: "sub"}}>
        {isDescOrder ? 'Descending Order' : 'Ascending Order'}
      </span>
      <div className="timeline">
        {locationStories.map((story, index) => {
          const imageUrl = extractFirstImageUrl(story.content);
          return (
            <div key={story.id} className="dot" style={{ left: `${(index + 1) * 10}%` }}>
              <StoryDetailsBox
                story={story}
                onClick={() => handleStoryClick(story.id)}
                imageUrl={imageUrl}
              />
              {/* <p className="story-date">{formatDate(story)}</p> */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LocationSearch;
