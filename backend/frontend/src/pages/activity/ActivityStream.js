import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
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
    if (activityType === 'new_commented_on_story') {
      formattedType = activityType.replace('new_commented_on_story', ' Commented on your story!'); // 'story_liked' -> 'liked'
    }
    if (activityType === 'new_comment_on_comment') {
      formattedType = activityType.replace('new_comment_on_comment', ' Commented on a story you have commented!'); // 'story_liked' -> 'liked'
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
      } else if (activity.activity_type === 'new_story' || activity.activity_type === 'story_liked' || activity.activity_type === 'story_unliked' || activity.activity_type === 'new_commented_on_story' || activity.activity_type === 'new_comment_on_comment' ) {
        navigate(`/story/${activity.target_story}`);
      }
      // Add more cases as needed
    } catch (error) {
      console.error('Error updating activity:', error);
    }
  };

  const getActivityColor = (activityType) => {
    // Define colors based on activity types
    switch (activityType) {
      case 'story_liked':
        return '#FFFFFF';
      case 'new_commented_on_story':
        return '#FFFFFF';
      case 'followed_user':
        return '#FFFFFF';
      case 'unfollowed_user':
        return '#FFFFFF';
      default:
        return '#FFFFFF'; // Default color
    }
  };

  const getIconForActivity = (activityType) => {
    switch (activityType) {
      case 'story_liked':
        return <FavoriteIcon color="error" />;
      case 'new_commented_on_story':
        return <CommentIcon color="info" />;
      case 'followed_user':
        return <PersonAddIcon color="success" />;
      case 'unfollowed_user':
        return <PersonRemoveIcon color="disabled" />;
      default:
        return null; // No icon for other types
    }
  };

  const categorizeActivities = () => {
    const categorized = {};
    activities.forEach(activity => {
      const category = activity.activity_type;
      if (!categorized[category]) {
        categorized[category] = [];
      }
      categorized[category].push(activity);
    });
    return categorized;
  };

  const renderList = (category, activities) => (
    <Grid item xs={12} sm={6} md={3} key={category}>
      <Box>
        {activities.length > 0 && (
          <Typography variant="h6" gutterBottom>
            {getIconForActivity(activities[0].activity_type)}
          </Typography>
        )}
        {activities.map(activity => (
          <Card key={activity.id} sx={{ width: '100%', my: 1, border: '2px solid #7E49FF', borderRadius: '8px', cursor: 'pointer', backgroundColor: getActivityColor(activity.activity_type), boxShadow: '0 4px 8px rgba(197,180,239,0.2)', animation: 'fadeIn 0.5s ease' }} onClick={() => handleActivityClick(activity)}>
            <CardContent>
              <Typography variant="subtitle1">
                {activity.target_user_username && `${activity.target_user_username} `}
                {formatActivityType(activity.activity_type)}
                {activity.target_story_title && ` ${activity.target_story_title}`}
              </Typography>
              <Typography variant="caption">
                {new Date(activity.date).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Grid>
  );

  return (
    <Box sx={{ m: 'auto', maxWidth: '1200px', height: '100vh', padding: '10px' }}>
      <Typography variant="h4" align="center" gutterBottom>
      Activity Stream
      </Typography>
      <Grid container spacing={3}>
        {Object.entries(categorizeActivities()).map(([category, activities]) => renderList(category, activities))}
      </Grid>
    </Box>
  );
}

export default withAuth(ActivityStream);
