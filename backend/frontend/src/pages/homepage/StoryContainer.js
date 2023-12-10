import React, { useState } from 'react';
import StoriesbyFollowingUsers from './StoriesbyFollowingUsers';
import AllStories from './AllStories';
import styles from './StoryContainer.module.css';
import Button from '@mui/material/Button';

function StoryContainer() {
  const [showFollowingsStories, setShowFollowingsStories] = useState(false);

  return (
    <div>
      <div className={styles.storyButtons} >
        <Button
          variant="contained"
          color={showFollowingsStories ? 'primary' : 'secondary'}
          onClick={() => setShowFollowingsStories(false)}
          style={{ fontFamily: "'Josefin Sans', sans-serif" }}

        >
          All Stories
        </Button>
        <Button
          variant="contained"
          color={!showFollowingsStories ? 'primary' : 'secondary'}
          onClick={() => setShowFollowingsStories(true)}
          style={{ marginLeft: '10px', fontFamily: "'Josefin Sans', sans-serif" }}
          >
          Followings Stories
        </Button>

      </div>
      <br/>
      {showFollowingsStories ? <StoriesbyFollowingUsers /> : <AllStories />}
    </div>
  );
}

export default StoryContainer;
