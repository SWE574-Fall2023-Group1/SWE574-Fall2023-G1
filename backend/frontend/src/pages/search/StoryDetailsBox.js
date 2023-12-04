// StoryDetailsBox.js
import React, { useState } from 'react';
import './StoryDetailsBox.css';

// Update the StoryDetailsBox component
const StoryDetailsBox = ({ story, onClick, imageUrl }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
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
    <div
      className={`story-details-box ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt={`Story titled ${story.title}`} // More descriptive alt text
          className="story-image"
        />
      )}
      <h3 className="story-title-box">{story.title}</h3>
      <p className="story-date-box">{formatDate(story)}</p>
      <p className="story-author-box">by {story.author_username || 'Unknown'}</p>
    </div>
  );
};

export default StoryDetailsBox;
