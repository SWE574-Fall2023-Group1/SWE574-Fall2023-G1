import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import withAuth from '../../authCheck';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './CreateStory.css'
import {TextField, Select, MenuItem, InputLabel, FormControl, Button, Checkbox, FormControlLabel } from '@mui/material';
import ImageCompress from 'quill-image-compress';
import Quill from 'quill'
import StoryMap from './StoryMap';
import TagSearch from './TagSearch'; // Adjust the path as needed
import Chip from '@mui/material/Chip';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format, parseISO } from 'date-fns';

let postHeader = null;

function CreateStory({ currentTheme }) {

  const { storyId } = useParams(); // Get story ID from URL
  const isEditMode = storyId != null;
  if (isEditMode) {
    postHeader = 'Edit Memory';
  } else {
    postHeader = 'Create New Memory';
  }

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [story_tags, setStoryTags] = useState('');
  const [location_ids, setLocations] = useState([]);
  const [date_type, setDateType] = useState('season');
  const [season_name, setSeasonName] = useState(null);
  const [year, setYear] = useState(null);
  const [start_year, setStartYear] = useState(null);
  const [end_year, setEndYear] = useState(null);
  const [date, setDate] = useState(null);
  const [start_date, setStartDate] = useState(null);
  const [end_date, setEndDate] = useState(null);
  const [decade, setDecade] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const [firstClick, setFirstClick] = useState(true);
  const [include_time, setIncludeTime] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    if (isEditMode) {
      axios.get(`http://${process.env.REACT_APP_BACKEND_HOST_NAME}:8000/user/storyGet/${storyId}`, { withCredentials: true })
        .then(response => {
          const storyInfo = response.data;
          console.log('Fetched story data:', storyInfo); // Log to verify fetched data

          setTitle(storyInfo.title);
          setContent(storyInfo.content);
          if (storyInfo.story_tags && storyInfo.story_tags.length) {
            // Replicate what addTag does here for each tag
            storyInfo.story_tags.forEach(tag => {
              // Assuming addTag adds the tag to selectedTags and story_tags
              setSelectedTags(prevTags => [...prevTags, tag]);
              setStoryTags(prevStoryTags => [...prevStoryTags, tag]); // If story_tags is an array of tag objects
            });
          }
          if (storyInfo.location_ids && storyInfo.location_ids.length) {
            setLocations(storyInfo.location_ids.map(location => ({ ...location, id: location.id.toString() })));
          }
          setDateType(storyInfo.date_type);
          setYear(storyInfo.year);
          setSeasonName(storyInfo.season_name);
          setStartYear(storyInfo.start_year);
          setEndYear(storyInfo.end_year);
          setDate(storyInfo.date);
          setStartDate(storyInfo.start_date);
          setEndDate(storyInfo.end_date);
          setDecade(storyInfo.decade);
          setIncludeTime(storyInfo.include_time);
          // ... handle other fields as needed ...
          console.log('State after setting:', { year, season_name, start_year, end_year, date, start_date, end_date, decade, location_ids });

        })
        .catch(error => console.error('Error fetching story:', error));
    }
  }, [storyId, isEditMode]);

  const addTag = (tag) => {
    console.log("Adding Tag", tag);
    if (!selectedTags.find(t => t.wikidata_id === tag.wikidata_id)) {
      setSelectedTags([...selectedTags, tag]);
      setStoryTags([...story_tags, {
        name: tag.name, // Include the name of the tag
        label: tag.label,
        wikidata_id: tag.wikidata_id,
        description: tag.description
      }]);
    }
  };

  const removeTag = (tagId) => {
    console.log("Removing Tag", tagId);

    // Update selectedTags
    const newSelectedTags = selectedTags.filter(tag => tag.wikidata_id !== tagId);
    setSelectedTags(newSelectedTags);

    // Update story_tags
    const newStoryTags = story_tags.filter(tag => tag.wikidata_id !== tagId);
    setStoryTags(newStoryTags);
  };


  const navigate = useNavigate();

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

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video"
  ];

  useEffect(() => {
    setSeasonName(null);
    setYear(null);
    setStartYear(null);
    setEndYear(null);
    setDate(null);
    setStartDate(null);
    setEndDate(null);
    setDecade(null);
  }, [date_type]);
  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY; // Securely manage this


  const handleEditorClick = () => {
    if (firstClick) {
      setContent('');
      setFirstClick(false);
    }
  };

  const handleAddLocation = (location) => {
    console.log('Selected location:', location); // This will log the location to the console
    // Assuming the `location` structure matches what your backend expects for `location_ids`
    setLocations(location_ids => {
      // Appending the new location to the previous locations array
      return [...location_ids, location];
    });
  };

  const handleUpdateLocations = (updatedLocations) => {
    setLocations(updatedLocations);
  };

  const handleRemoveLocation = (index) => {
    const updatedLocations = location_ids.filter((_, i) => i !== index);
    setLocations(updatedLocations); // Update the location_ids state
  };

  const editorPlaceholder = firstClick ? 'Write down your memory here' : '';

  const convertUTCToLocalDate = (utcDateString) => {
    if (!utcDateString) return null;

    // Parse the ISO string to a Date object
    const date = parseISO(utcDateString);

    // Format the date to a string in the local timezone including timezone offset
    // 'X' will give you the timezone offset in hours and minutes (e.g., -04, +03)
    // 'XX' will give you the timezone offset with a colon (e.g., -04:00, +03:00)
    return format(date, "yyyy-MM-dd'T'HH:mm:ssXX");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const localDate = convertUTCToLocalDate(date);
    const localStartDate = convertUTCToLocalDate(start_date);
    const localEndDate = convertUTCToLocalDate(end_date);

    const storyData = {
      title: title,
      content: content,
      story_tags: story_tags,
      location_ids: location_ids,
      date_type: date_type,
      season_name: season_name,
      start_year: start_year,
      end_year: end_year,
      year: year,
      date: localDate,
      start_date: localStartDate,
      end_date: localEndDate,
      decade: decade,
      include_time: include_time
    };

    try {
      let response;
      if (isEditMode) {
        // Update existing story
        response = await axios.put(`http://${process.env.REACT_APP_BACKEND_HOST_NAME}:8000/user/storyUpdate/${storyId}`, storyData, { withCredentials: true });
        navigate(`/story/${storyId}`);
      } else {
        // Create new story
        response = await axios.post(`http://${process.env.REACT_APP_BACKEND_HOST_NAME}:8000/user/storyCreate`, storyData, { withCredentials: true });
        navigate(`/story/${response.data.id}`);
      }

    } catch (error) {
      console.error('Error submitting story:', error);
      toast.error('Please fill all fields correctly');
    }
  };


  return (
    <div>
      <h1 className="big-heading" style={{ color: currentTheme === 'custom' ? '#ffffff' : '#000000', fontFamily: "'Josefin Sans', sans-serif" }}>
        {postHeader}
      </h1>
    <div className='create-story-container'>
      <div className="create-story-content">
        <div className="formBackground">
          <form>
            {/* <div className="form-group"> */}
              <TextField
                  variant="outlined"
                  placeholder="Title"
                  className='long-boxes'
                  label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
            {/* </div> */}
            {/* <div className="form-group"> */}
            <br/>
            <br/>
              <ReactQuill
                modules={modules}
                formats={formats}
                className="custom-input"
                theme="snow"
                value={content}
                onClick={handleEditorClick}
                placeholder={editorPlaceholder}
                onChange={setContent}
              />
            {/* </div> */}
            <br/>
            <br/>
            <br/>
            <div className='tags-bar' id="tags-bar">
              <TagSearch style={{backgroundColor: "rgb(240, 240, 240)"}} onTagSelect={addTag} />
              <div>
                {selectedTags.map((tag, index) => (
                  <Chip
                    style={{margin: "1px", backgroundColor: "rgb(240, 240, 240)"}}
                    key={index}
                    label={tag.label}
                    onDelete={() => removeTag(tag.wikidata_id)}
                  />
                ))}
              </div>
            </div>
            <div style={{ marginTop: '1rem' }}>
            <FormControl variant="outlined" >
                <InputLabel id="date-type-label">Date Type</InputLabel>
                <Select
                  labelId="date-type-label"
                  placeholder = "Date Type"
                  id="date-type"
                  className='date-box'
                  value={date_type}
                  onChange={(e) => setDateType(e.target.value)}
                  label="Date Type"
                >
                  <MenuItem value="">Select a date type</MenuItem>
                  <MenuItem value="year">Year</MenuItem>
                  <MenuItem value="year_interval">Interval Year</MenuItem>
                  <MenuItem value="normal_date">Normal Date</MenuItem>
                  <MenuItem value="interval_date">Interval Date</MenuItem>
                  <MenuItem value="decade">Decade</MenuItem>
                </Select>
              </FormControl>
            </div>
            {date_type === 'year' &&
            <div className='date-type'>
              <TextField
                id="year"
                className='date-box'
                label="Year"
                variant="outlined"
                type="text"
                value={year || ''} // Bind value to the state variable
                onChange={(e) => setYear(e.target.value)}
              />
              <FormControl variant="outlined">
                <InputLabel id="season-label">Season</InputLabel>
                <Select
                  labelId="season-label"
                  id="season"
                  className='date-box'
                  value={season_name}
                  onChange={(e) => setSeasonName(e.target.value)}
                  label="Season"
                >
                  <MenuItem value="">Select a season</MenuItem>
                  <MenuItem value="Spring">Spring</MenuItem>
                  <MenuItem value="Summer">Summer</MenuItem>
                  <MenuItem value="Fall">Fall</MenuItem>
                  <MenuItem value="Winter">Winter</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                    }
          {date_type === 'year_interval' &&
            <div className='date-type'>
              <TextField
                id="start-year"
                className='date-box'
                label="Start Year"
                variant="outlined"
                type="number"
                onChange={(e) => setStartYear(e.target.value)}
              />
              <TextField
                id="end-year"
                className='date-box'
                label="End Year"
                variant="outlined"
                type="number"
                onChange={(e) => setEndYear(e.target.value)}
              />
              <FormControl variant="outlined">
                <InputLabel id="season-label">Season</InputLabel>
                <Select
                  labelId="season-label"
                  id="season"
                  className='date-box'
                  value={season_name}
                  onChange={(e) => setSeasonName(e.target.value)}
                  label="Season"
                >
                  <MenuItem value="">Select a season</MenuItem>
                  <MenuItem value="Spring">Spring</MenuItem>
                  <MenuItem value="Summer">Summer</MenuItem>
                  <MenuItem value="Fall">Fall</MenuItem>
                  <MenuItem value="Winter">Winter</MenuItem>
                </Select>
              </FormControl>
            </div>
          }
          {date_type === 'normal_date' &&
              <div className='date-type'>
                <TextField
                  className='date-box'
                  label="Date"
                  variant="outlined"
                  timezone="Europe/Istanbul"
                  type={include_time ? "datetime-local" : "date"}
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => setDate(e.target.value)}
                />
                <FormControlLabel
                  style={{ color: currentTheme === 'custom' ? '#ffffff' : '#000000' }}
                  control={
                    <Checkbox
                      style={{ color: currentTheme === 'custom' ? '#ffffff' : '#000000' }}
                      checked={include_time}
                      onChange={(e) => setIncludeTime(e.target.checked)}
                    />
                  }
                  label="Include time"
                />
              </div>
            }
            {date_type === 'interval_date' && (
              <div className='date-type'>
                <TextField
                  className='date-box'
                  type={include_time ? "datetime-local" : "date"}
                  label="Start Date"
                  variant="outlined"
                  timezone="Europe/Istanbul"
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <TextField
                  className='date-box'
                  type={include_time ? "datetime-local" : "date"}
                  label="End Date"
                  variant="outlined"
                  timezone="Europe/Istanbul"
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <FormControlLabel
                  style={{ color: currentTheme === 'custom' ? '#ffffff' : '#000000' }}
                  control={
                    <Checkbox
                      style={{ color: currentTheme === 'custom' ? '#ffffff' : '#000000' }}
                      checked={include_time}
                      onChange={(e) => setIncludeTime(e.target.checked)}
                    />
                  }
                  label="Include time"
                />
              </div>
            )}
            {date_type === 'decade' &&
                <div className='date-type'>
                    <FormControl variant="outlined" className='date-box'>
                        <InputLabel id="decade-label">Decade</InputLabel>
                        <Select
                            labelId="decade-label"
                            id="decade"
                            value={decade}
                            onChange={(e) => setDecade(e.target.value)}
                            label="Decade"
                        >
                            <MenuItem value="">Select a decade</MenuItem>
                            <MenuItem value={1900}>1900s</MenuItem>
                            <MenuItem value={1910}>1910s</MenuItem>
                            <MenuItem value={1920}>1920s</MenuItem>
                            <MenuItem value={1930}>1930s</MenuItem>
                            <MenuItem value={1940}>1940s</MenuItem>
                            <MenuItem value={1950}>1950s</MenuItem>
                            <MenuItem value={1960}>1960s</MenuItem>
                            <MenuItem value={1970}>1970s</MenuItem>
                            <MenuItem value={1980}>1980s</MenuItem>
                            <MenuItem value={1990}>1990s</MenuItem>
                            <MenuItem value={2000}>2000s</MenuItem>
                            <MenuItem value={2010}>2010s</MenuItem>
                            <MenuItem value={2020}>2020s</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            }
          <br/>
          <div className='create-story-map'>
          <text style={{ color: currentTheme === 'custom' ? '#ffffff' : '#000000' }}>You can add locations by using the map or typing in the search bar.</text>
            <StoryMap
                  mapContainerStyle={{ height: '400px', width: '100%', borderRadius: '10px', borderStyle: "solid" }}
                  initialCenter={mapCenter}
                  zoom={1}
                  apiKey={googleMapsApiKey}
                  onAddLocation={handleAddLocation}
                  onRemoveLocation={handleRemoveLocation}
                  onUpdateLocations={handleUpdateLocations}
                  currentTheme={currentTheme}
                />
          </div>
          <br/>
          <Button style={{borderRadius: 10, backgroundColor: "#7E49FF", padding: "8px 16px", fontSize: "16px"}} variant="contained" onClick={handleSubmit} className="btn btn-primary middle">{postHeader}</Button>
          <br/>
          <br/>
          <text style={{ color: currentTheme === 'custom' ? '#ffffff' : '#000000' }} >You can edit your memory as many times as you want after posting.</text>
          <br/>
          <br/>
          </form>
          </div>
        </div>
        </div>
        <ToastContainer position="bottom-right" autoClose={5000} />
    </div>
  );
}

export default withAuth(CreateStory);
