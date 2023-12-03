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

  const formatDate = (date) => {
    // Your existing formatDate logic here
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
