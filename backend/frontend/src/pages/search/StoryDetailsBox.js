// StoryDetailsBox.js
import React, { useState } from 'react';
import './StoryDetailsBox.css';

// Update the StoryDetailsBox component
const StoryDetailsBox = ({ story, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const formatDate = (date) => {
    // Your existing formatDate logic here
  };

  return (
    <div
      className={`story-details-box ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick} // Add the onClick handler here
    >
      <h3 className="story-title-box">{story.title}</h3>
      <p className="story-date-box">{formatDate(story)}</p>
      <p className="story-author-box">by {story.author_username || 'Unknown'}</p>
    </div>
  );
};

export default StoryDetailsBox;
