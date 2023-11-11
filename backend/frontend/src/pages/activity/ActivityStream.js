import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
//import './ActivityStream.css'; // You should create this CSS file to style your component
import withAuth from '../../authCheck';

function ActivityStream() {
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(`http://${process.env.REACT_APP_BACKEND_HOST_NAME}:8000/user/activities`, { withCredentials: true });
        // Filter out activities that have been viewed
        const unviewedActivities = response.data.filter(activity => !activity.viewed);
        setActivities(unviewedActivities);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };

    fetchActivities();
  }, []);

  function formatActivityType(activityType) {
    let formattedType = activityType;

    // Check for story related activities
    if (activityType === 'new_story') {
      formattedType = activityType.replace('new_story', 'Created a new story!'); // 'story_liked' -> 'liked'
    }
    if (activityType === 'story_liked') {
      formattedType = activityType.replace('story_', ''); // 'story_liked' -> 'liked'
    }
    if (activityType === 'story_unliked') {
      formattedType = activityType.replace('story_', ''); // 'story_liked' -> 'liked'
    }
    if (activityType === 'followed_user') {
      formattedType = activityType.replace('_user', ' you!'); // 'story_liked' -> 'liked'
    }
    if (activityType === 'unfollowed_user') {
      formattedType = activityType.replace('_user', ' you!'); // 'story_liked' -> 'liked'
    }

    return formattedType.charAt(0).toUpperCase() + formattedType.slice(1); // Capitalize the first letter
  }

  const handleActivityClick = async (activity) => {
    // Update the activity as viewed on the server
    try {
      await axios.patch(`http://${process.env.REACT_APP_BACKEND_HOST_NAME}:8000/user/activities/${activity.id}`, { viewed: true }, { withCredentials: true });

      // Update the activity as viewed in the local state
      setActivities(prevActivities => prevActivities.map(act =>
        act.id === activity.id ? { ...act, viewed: true } : act
      ));

      // Navigate to the relevant page based on activity type
      if (activity.activity_type === 'followed_user' || activity.activity_type === 'unfollowed_user') {
        navigate(`/user-profile/${activity.target_user}`);
      } else if (activity.activity_type === 'new_story' || activity.activity_type === 'story_liked' || activity.activity_type === 'story_unliked' ) {
        navigate(`/story-details/${activity.target_story}`);
      }
      // Add more cases as needed
    } catch (error) {
      console.error('Error updating activity:', error);
    }
  };

  return (
    <Box sx={{ m: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Activity Stream
      </Typography>
      {activities.length === 0 ? (
        <Typography variant="body1">No activities found.</Typography>
      ) : (
        activities.map(activity => (
          <Box key={activity.id} sx={{ p: 1, my: 1, border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }} onClick={() => handleActivityClick(activity)}>
            <Typography variant="subtitle1">
              {/* Display user-related information */}
              {activity.target_user_username && `${activity.target_user_username} `}

              {/* Display activity type */}
              {formatActivityType(activity.activity_type)}

              {/* Display story-related information */}
              {activity.target_story_title && ` ${activity.target_story_title}`}
            </Typography>
            <Typography variant="caption">
              {new Date(activity.date).toLocaleString()}
            </Typography>
          </Box>
        ))
      )}
    </Box>
  );
}

export default withAuth(ActivityStream);
