import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams,useNavigate  } from 'react-router-dom';
import './StoryDetails.css';
import { GoogleMap, Marker, Polyline, Polygon, Circle } from '@react-google-maps/api';
import withAuth from '../../authCheck';
import CommentSection from './CommentSection';
import ReactQuill from 'react-quill';
import ImageCompress from 'quill-image-compress';
import Quill from 'quill'
import 'react-quill/dist/quill.snow.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Chip from '@mui/material/Chip';
import FavoriteIcon from '@mui/icons-material/Favorite';

function StoryDetails() {
  const [story, setStory] = useState(null);
  //const [author, setAuthor] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [numLikes, setNumLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [userId, setUserId] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [username, setUsername] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [open, setOpen] = React.useState(false);
  // const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // const PHOTOS_PER_PAGE = 3;
  // const COMMENTS_PER_PAGE = 5;

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`http://${process.env.REACT_APP_BACKEND_HOST_NAME}:8000/user/userDetails`, { withCredentials: true });
      setUserId(response.data.id);
      setUsername(response.data.username);
    } catch (error) {
      console.log(error);
    }
  };


  const handleMarkerClick = (location) => {
    let locationData = {};

    if (location.point) {
        const coords = location.point.slice(17).slice(0, -1).split(' ');
        locationData = { latitude: parseFloat(coords[1]), longitude: parseFloat(coords[0]), type: 'Point' };
    }
    else if (location.line) {
        const lineCoords = location.line.slice(17).slice(0, -1).split(', ');
        locationData = {
            type: 'LineString',
            coordinates: lineCoords.map(coord => {
                const [lng, lat] = coord.split(' ');
                return { lat: parseFloat(lat), lng: parseFloat(lng) };
            })
        };
    }
    else if (location.polygon) {
        const polyCoords = location.polygon.slice(17).slice(0, -1).split(', ');
        locationData = {
            type: 'Polygon',
            coordinates: polyCoords.map(coord => {
                const [lng, lat] = coord.split(' ');
                return { lat: parseFloat(lat), lng: parseFloat(lng) };
            })
        };
    }
    else if (location.circle && location.radius) {
        const circleCoords = location.circle.slice(17).slice(0, -1).split(' ');
        locationData = {
            type: 'Circle',
            center: { lat: parseFloat(circleCoords[1]), lng: parseFloat(circleCoords[0]) },
            radius: parseFloat(location.radius)
        };
    }

    const locationJSON = JSON.stringify(locationData);
    console.log("locationJSON",locationJSON)
    navigate(`/timeline/${locationJSON}`);
};





useEffect(() => {
  const fetchStory = async () => {
    try {
      await fetchUserDetails(); // Get the current user ID
      const response = await axios.get(`http://${process.env.REACT_APP_BACKEND_HOST_NAME}:8000/user/storyGet/${id}`, { withCredentials: true });

      // Parse location fields for each location
      const modifiedLocations = response.data.location_ids.map(location => {
        let coordinates;
        if (location.point) {
          const pointCoords = location.point.slice(17).slice(0, -1).split(' ');
          coordinates = { lat: parseFloat(pointCoords[1]), lng: parseFloat(pointCoords[0]) };
        } else if (location.line) {
          const lineCoords = location.line.slice(17).slice(0, -1).split(', ');
          coordinates = lineCoords.map(coord => {
            const [lng, lat] = coord.split(' ');
            return { lat: parseFloat(lat), lng: parseFloat(lng) };
          });
        } else if (location.polygon) {
          const polyCoords = location.polygon.slice(17).slice(0, -1).split(', ');
          coordinates = polyCoords[0].split(', ').map(coord => {
            const [lng, lat] = coord.split(' ');
            return { lat: parseFloat(lat), lng: parseFloat(lng) };
          });
        } else if (location.circle && location.radius) {
          const circleCoords = location.circle.slice(17).slice(0, -1).split(' ');
          coordinates = {
            center: { lat: parseFloat(circleCoords[1]), lng: parseFloat(circleCoords[0]) },
            radius: parseFloat(location.radius)
          };
        }

        // Return the modified location with the parsed coordinates
        return {
          ...location,
          coordinates: coordinates
        };
      });

      // Update the story state with the new location details including parsed coordinates
      setStory({ ...response.data, location_ids: modifiedLocations });

      // Determine if the user has liked the story
      setNumLikes(response.data.likes.length);
      setLiked(userId && response.data.likes.includes(userId));

    } catch (error) {
      console.log(error);
    }
  };

  fetchStory();
}, [userId]);


  // useEffect(()=>{
  //   console.log(story,"story")
  // },[story])

  const handleUserClick = async (id) => {
    navigate(`/user-profile/${id}`);
  };



  const formatDate = () => {

    let dateString = "";
    const optionsWithoutTime = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    const dateOptions = story.include_time ? options : optionsWithoutTime;

    switch (story.date_type) {
      case "decade":
        dateString = `Decade: ${story.decade}s`;
        break;
      case "year":
        dateString = `Year: ${story.year}`;
        break;
      case "year_interval":
        const startYear = story.start_year;
        const endYear = story.end_year;
        dateString = `Start: ${startYear} \n End: ${endYear}`;
        break;
      case "normal_date":
        const date = new Date(story.date).toLocaleDateString("en-US", dateOptions);
        dateString = `${date}`;
        break;
      case "interval_date":
        const startDate = new Date(story.start_date).toLocaleDateString("en-US", dateOptions);
        const endDate = new Date(story.end_date).toLocaleDateString("en-US", dateOptions);
        dateString = `Start: ${startDate} \n End: ${endDate}`;
        break;
      default:
        dateString = "";
    }
    return dateString;
  };


  const parseSRID = (sridString) => {
    // Remove the SRID=4326; part
    const coordsString = sridString.split(';')[1];

    // Determine the geometry type (POINT, LINESTRING, POLYGON)
    const geomType = coordsString.split(' ')[0];

    // Extract the coordinates, removing the geometry type and extra parentheses
    const coordsArray = coordsString.replace(geomType, '').replace(/[\(\)]/g, '').split(',').map(coord => {
      const points = coord.trim().split(' ');
      return { lat: parseFloat(points[1]), lng: parseFloat(points[0]) };
    });

    // Based on the geometry type, return the appropriate structure
    switch (geomType) {
      case 'POINT':
        return coordsArray[0];
      case 'LINESTRING':
      case 'POLYGON':
        return coordsArray;
      default:
        console.error('Unsupported geometry type:', geomType);
        return null;
    }
  };

  function StoryMarkers({ locations, handleMarkerClick }) {
    const shapes = locations.map((location, index) => {
      if (location.point) {
        const coords = parseSRID(location.point);
        return <Marker key={index} position={coords} onClick={() => handleMarkerClick(location)} />;
      } else if (location.line) {
        const path = parseSRID(location.line);
        return <Polyline key={index} path={path} options={{ strokeColor: "#FF0000" }} onClick={() => handleMarkerClick(location)} />;
      } else if (location.polygon) {
        const paths = parseSRID(location.polygon);
        return <Polygon key={index} paths={paths} options={{ fillColor: "#FFFF00" }} onClick={() => handleMarkerClick(location)} />;
      } else if (location.circle) {
        const center = parseSRID(location.circle);
        return <Circle key={index} center={center} radius={parseFloat(location.radius)} options={{ fillColor: "#0088FF" }} onClick={() => handleMarkerClick(location)} />;
      } else {
        return null;
      }
    });

    return <>{shapes}</>;
  }

  const handleLikeDislike = async () => {
    try {
      const response = await axios.post(`http://${process.env.REACT_APP_BACKEND_HOST_NAME}:8000/user/like/${id}`, {}, { withCredentials: true });
      if (response.data.msg === 'Liked.') {
        setNumLikes(numLikes + 1);
        setLiked(true);
      } else {
        setNumLikes(numLikes - 1);
        setLiked(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditButtonClick = () => {
    setIsEditMode(true);
    setOpen(true)
    setEditedContent(story.content);
    console.log(story,"story")
  };

  const handleSaveButtonClick = async () => {
    try {
      await axios.put(
        `http://${process.env.REACT_APP_BACKEND_HOST_NAME}:8000/user/storyUpdate/${id}`,
        { content: editedContent },
        { withCredentials: true }
      );
      setIsEditMode(false);
      setStory({ ...story, content: editedContent });
    } catch (error) {
      console.log(error);
    }
    setOpen(false)
  };

  Quill.register('modules/imageCompress', ImageCompress);

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image", "video"],
      ],
    },
    imageCompress: {
      quality: 0.7, // default
      maxWidth: 1024, // default
      maxHeight: 1024, // default
      imageType: 'image/jpeg', // default
      debug: false, // default
    }
};


  return (
    <div className="story-details-wrapper">
      {story ? (
        <Box sx={{ borderRadius: "10px", boxShadow: "0 0 10px rgba(0,0,0,0.2)", p: 2, backgroundColor: "#f5f5f5" }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ mt: 1, mb: 3 }}>
            {story.title}
          </Typography>
          <div className="content-container">
            <div className="left-side">
              <div className="quill-container">
                <ReactQuill
                  className="story-content"
                  value={story.content}
                  readOnly={true}
                  modules={{ toolbar: false }}
                />
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box className="story-edit-modal">
                    <ReactQuill
                      className="custom-input"
                      value={editedContent}
                      readOnly={false}
                      onChange={setEditedContent}
                      modules={modules}
                    />
                <div className="save-button-container">
                    <Button onClick={handleSaveButtonClick}>Save</Button>
                  </div>
                  </Box>
                </Modal>
                {userId === story.author && (
                <Button onClick={handleEditButtonClick}>Edit</Button>
              )}
              </div>
            </div>
            <div className="right-side">
              {story.location_ids.length > 0 && (
                <>
                  <div className="storydetail-story-map">
                    <GoogleMap
                      mapContainerStyle={{ height: "400px", width: "400px" }}
                      zoom={2}
                      center={{
                        lat: 0,
                        lng: 0,
                      }}
                    >
                      <StoryMarkers locations={story.location_ids} handleMarkerClick={handleMarkerClick} />

                    </GoogleMap>
                  </div>
                </>
              )}
              <div className="author-date-container">
              <div>
                <Typography variant="subtitle1">Author</Typography>
                <Chip
                  label={story.author_username}
                  onClick={() => handleUserClick(story.author)}
                  color="primary"
                  variant="outlined"
                />
              </div>
              <div >
                <Typography variant="subtitle1">Creation Date</Typography>
                <Typography variant="body1" className="info-box">
                  {new Date(story.creation_date).toLocaleDateString()}
                </Typography>
              </div>
              <div className="like-container">
                <div className="heart-container">
                  <Button
                    onClick={handleLikeDislike}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <FavoriteIcon
                      fontSize="small"
                      style={{ color: liked ? 'red' : 'black' }}
                      onClick={() => setLiked(!liked)}
                    />
                  </Button>
                  <Chip label={numLikes} />
                </div>
              </div>
            </div>
            </div>
          </div>
          <div className="bottom-container">
            <div >
              <Typography variant="subtitle1">Story Time</Typography>
              <Typography variant="body1" className="info-box">{`${formatDate()}`}</Typography>
            </div>
            {story.season_name && (
              <div>
                <Typography variant="subtitle1">Season</Typography>
                <Typography variant="body1" className="info-box">{story.season_name}</Typography>
              </div>
            )}
            <div >
              <Typography variant="subtitle1">Tags</Typography>
              <div className="tags-container">
                {story.story_tags
                  .split(",")
                  .map((tag, index) => (
                    <div key={index} className="tag-box">
                      <Typography variant="body1">{tag.trim()}</Typography>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <CommentSection
            storyId={id}
            comments={comments}
            setComments={setComments}
          />
        </Box>
      ) : (
        <Typography variant="h5" align="center">
          Loading story details...
        </Typography>
      )}
    </div>
  );
}

export default withAuth(StoryDetails);
