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


function EditStory() {

  const { storyId } = useParams(); // Get story ID from URL
  const isEditMode = storyId != null;

  const postHeader = 'Edit Memory';
  const postButton = 'Update Memory';

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
  const parseSRID = (sridString) => {
    if (!sridString) return null;

    // Remove the SRID=4326; part and extract coordinates
    const coordsString = sridString.split(';')[1];

    // Determine the geometry type (POINT, LINESTRING, POLYGON)
    const geomType = coordsString.split(' ')[0];

    // Extract the coordinates
    let coordsArray = coordsString.replace(geomType, '').replace(/[\(\)]/g, '').split(',');

    // Parse coordinates based on geometry type
    switch (geomType) {
        case 'POINT':
            return {
                type: 'Point',
                coordinates: coordsArray[0].trim().split(' ').map(Number)
            };
        case 'LINESTRING':
            return {
                type: 'LineString',
                coordinates: coordsArray.map(coord => coord.trim().split(' ').map(Number))
            };
        case 'POLYGON':
            return {
                type: 'Polygon',
                coordinates: [coordsArray.map(coord => coord.trim().split(' ').map(Number))]
            };
        default:
            console.error('Unsupported geometry type:', geomType);
            return null;
    }
};

const parseLocation = (location) => {
    return {
        ...location,
        point: parseSRID(location.point),
        line: parseSRID(location.line),
        polygon: parseSRID(location.polygon),
        circle: location.circle ? {
            ...parseSRID(location.circle),
            radius: parseFloat(location.radius)
        } : null
    };
};


  useEffect(() => {
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
            const parsedLocations = storyInfo.location_ids.map(parseLocation);
            setLocations(parsedLocations);
          }
          console.log('State after setting:', {
            // ... other state variables ...
            location_ids: location_ids // or just location_ids if you want to log the original data
          });
          setDateType(storyInfo.date_type);
          // eslint-disable-next-line default-case
          switch(storyInfo.date_type) {
            case 'year':
                setYear(storyInfo.year);
                setSeasonName(storyInfo.season_name);
                break;
            case 'year_interval':
                setStartYear(storyInfo.start_year);
                setEndYear(storyInfo.end_year);
                setSeasonName(storyInfo.season_name);
                break;
            case 'normal_date':
                setDate(storyInfo.date);
                break;
            case 'interval_date':
                setStartDate(storyInfo.start_date);
                setEndDate(storyInfo.end_date);
                break;
            case 'decade':
                setDecade(storyInfo.decade);
                break;
            }
            console.log("date",date)
          setIncludeTime(storyInfo.include_time);
          // ... handle other fields as needed ...
        })
        .catch(error => console.error('Error fetching story:', error));
    }
  , [storyId, isEditMode]);

  useEffect(() => {
    console.log("Current locations state:", location_ids);
    }, [location_ids]);

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

    // Remove tag from selectedTags
    const updatedSelectedTags = selectedTags.filter(tag => tag.wikidata_id !== tagId);
    setSelectedTags(updatedSelectedTags);

    // Remove tag from story_tags if it's an existing tag (check if it has an id)
    const updatedStoryTags = story_tags.filter(tag => tag.wikidata_id !== tagId);
    setStoryTags(updatedStoryTags);
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
    // Reset states based on the selected date type
    switch(date_type) {
      case 'year':
        setStartYear(null);
        setEndYear(null);
        setDate(null);
        setStartDate(null);
        setEndDate(null);
        setDecade(null);
        break;
      case 'year_interval':
        setYear(null);
        setDate(null);
        setStartDate(null);
        setEndDate(null);
        setDecade(null);
        break;
      case 'normal_date':
        setYear(null);
        setStartYear(null);
        setEndYear(null);
        setStartDate(null);
        setEndDate(null);
        setDecade(null);
        break;
      case 'interval_date':
        setYear(null);
        setStartYear(null);
        setEndYear(null);
        setDate(null);
        setDecade(null);
        break;
      case 'decade':
        setYear(null);
        setStartYear(null);
        setEndYear(null);
        setDate(null);
        setStartDate(null);
        setEndDate(null);
        break;
      default:
        // Do nothing if date_type is not set or is an unexpected value
        break;
    }
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


  const handleSubmit = async (e) => {
    e.preventDefault();
    const prepareLocationData = (location) => {
    let preparedLocation = {
        id: location.id,
        name: location.name,
        success: location.success,
        msg: location.msg,
    };

    // Add non-null fields to the prepared location object
    if (location.point) {
        preparedLocation.point = location.point;
    }
    if (location.line) {
        preparedLocation.line = location.line;
    }
    if (location.polygon) {
        preparedLocation.polygon = location.polygon;
    }
    if (location.circle) {
        preparedLocation.circle = location.circle;
        preparedLocation.radius = location.radius;
    }

    return preparedLocation;
    };

    // Before sending the request
    const preparedLocations = location_ids.map(location => prepareLocationData(location));


    const storyData = {
      title: title,
      content: content,
      story_tags: story_tags,
      location_ids: preparedLocations, // Use the filtered locations
      date_type: date_type,
      season_name: season_name,
      start_year: start_year,
      end_year: end_year,
      year: year,
      date: date,
      start_date: start_date,
      end_date: end_date,
      decade: decade,
      include_time: include_time
    };

    try {
      let response;
      // Update existing story
      response = await axios.put(`http://${process.env.REACT_APP_BACKEND_HOST_NAME}:8000/user/storyUpdate/${storyId}`, storyData, { withCredentials: true });
      navigate(`/story/${storyId}`);
    } catch (error) {
      console.error('Error submitting story:', error);
    }
};



  return (
    <div>
      <h1 className="big-heading">{postHeader}</h1>
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
              <TagSearch style={{"background-color": "rgb(240, 240, 240)"}} onTagSelect={addTag} />
              <div>
                {selectedTags.map((tag, index) => (
                  <Chip
                    style={{"background-color": "rgb(240, 240, 240)"}}
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
                value={start_year || ''}
                onChange={(e) => setStartYear(e.target.value)}
              />
              <TextField
                id="end-year"
                className='date-box'
                label="End Year"
                variant="outlined"
                type="number"
                value={end_year || ''}
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
                  value={include_time ? new Date(date).toISOString().slice(0, 16) : date.slice(0, 10)}
                  type={include_time ? "datetime-local" : "date"}
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => setDate(e.target.value)}
                />
                <FormControlLabel
                  control={
                    <Checkbox
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
                  value={include_time ? new Date(start_date).toISOString().slice(0, 16) : start_date.slice(0, 10)}
                  type={include_time ? "datetime-local" : "date"}
                  label="Start Date"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <TextField
                  className='date-box'
                  value={include_time ? new Date(end_date).toISOString().slice(0, 16) : end_date.slice(0, 10)}
                  type={include_time ? "datetime-local" : "date"}
                  label="End Date"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <FormControlLabel
                  control={
                    <Checkbox
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
          <text>You can add locations by using the map or typing in the search bar.</text>
          <StoryMap
                    mapContainerStyle={{ height: '400px', width: '100%', "border-radius": '10px', "border-style": "solid" }}
                    initialCenter={mapCenter}
                    zoom={1}
                    apiKey={googleMapsApiKey}
                    location_ids={location_ids}
                    onAddLocation={handleAddLocation}
                    onRemoveLocation={handleRemoveLocation}
                    onUpdateLocations={handleUpdateLocations}
                />
          </div>
          <br/>
          <Button style={{borderRadius: 10, backgroundColor: "#7E49FF", padding: "12px 28px", fontSize: "24px"}} variant="contained" onClick={handleSubmit} className="btn btn-primary middle">{postButton}</Button>
          <br/>
          <br/>
          <text>You can edit your memory as many times as you want after posting.</text>
          <br/>
          <br/>
          </form>
          </div>
        </div>
        </div>
    </div>
  );
}

export default withAuth(EditStory);
