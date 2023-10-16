import React, { useState,useRef,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, Marker, Autocomplete } from '@react-google-maps/api';
import styles from './StorySearch.css'
import './StorySearch.css'
import withAuth from '../../authCheck';
import {TextField, Select, MenuItem, InputLabel, FormControl,Slider, Button,List, ListItem, ListItemText } from '@mui/material';


const StorySearch = () => {
  const [titleSearch, setTitleSearch] = useState('');
  const [authorSearch, setAuthorSearch] = useState('');
  const [tagSearch, setTagSearch] = useState('');
  const [stories, setStories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [timeType, setTimeType] = useState('');
  const [seasonName, setSeasonName] = useState('');
  const [startYear, setStartYear] = useState(null);
  const [endYear, setEndYear] = useState(null);
  const [year, setYear] = useState('');
  const [date, setDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [decade, setDecade] = useState("");
  const [endDate, setEndDate] = useState('');
  const [locationSearch, setLocationSearch] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const [markerPosition, setMarkerPosition] = useState(mapCenter);
  const [radiusDiff, setRadiusDiff] = useState(25);
  const [dateDiff, setDateDiff] = useState(2);

  const autocompleteRef = useRef(null);

  const navigate = useNavigate();

  const handleStoryClick = async (id) => {
    navigate(`/story/${id}`);
  };
  
  const handleUserClick = async (id) => {
    navigate(`/user-profile/${id}`);
  };

  const handleSearch = async (e,pageNumber = 1) => {
    e.preventDefault();
    
    let timeValueObj = {};

    switch (timeType) {
        case 'decade':
        timeValueObj = { decade };
        break;
        case 'year':
        timeValueObj = { year, seasonName };
        break;
        case 'year_interval':
        timeValueObj = { startYear, endYear, seasonName };
        break;
        case 'normal_date':
        timeValueObj = { date };
        break;
        case 'interval_date':
        timeValueObj = { startDate, endDate };
        break;
        default:
        break;
    }
    
    try {
      const response = await axios.get(`http://${process.env.REACT_APP_BACKEND_HOST_NAME}:8000/user/storySearch`, {
        params: {
            title: titleSearch,
            author: authorSearch,
            tag: tagSearch, 
            page: pageNumber,
            size: pageSize,
            time_type: timeType,
            time_value: JSON.stringify(timeValueObj),
            location: JSON.stringify(locationSearch),
            radius_diff: radiusDiff,
            date_diff: dateDiff,
          },
        withCredentials: true,
      });
      setStories(response.data.stories);
      setTotalPages(response.data.total_pages);
      setCurrentPage(pageNumber);
      console.log(radiusDiff)
    } catch (error) {
      console.error('Error fetching stories:', error);
    } 
  };

  const handlePageChange = (newPage) => {
    handleSearch({ preventDefault: () => {} }, newPage);
  };

  const renderTimeInput = () => {
    switch (timeType) {
      case 'year':
        return (
          <div className='date-type-search'>
          <TextField
            id="year"
            className='date-box-search'
            label="Year"
            variant="outlined"
            type="number"
            onChange={(e) => setYear(e.target.value)}
          />
          <FormControl variant="outlined">
            <InputLabel id="season-label">Season</InputLabel>
            <Select
              labelId="season-label"
              id="season"
              className='date-box-search'
              value={seasonName}
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
        );
      case 'year_interval':
        return (
          <div className='date-type-search'>
              <TextField
                id="start-year"
                className='date-box-search'
                label="Start Year"
                variant="outlined"
                type="number"
                onChange={(e) => setStartYear(e.target.value)}
              />
              <TextField
                id="end-year"
                className='date-box-search'
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
                  className='date-box-search'
                  value={seasonName}
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
        );
      case 'normal_date':
        return (
          <div className='date-type-search'>
              <TextField
                className='date-box-search'
                label="Date Time"
                variant="outlined"
                type="date"
                InputLabelProps={{ shrink: true }}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
        );
      case 'interval_date':
        return (
          <div className='date-type-search'>
              <TextField
                className='date-box-search'
                type="date"
                label="Start Date Time"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <TextField
                className='date-box-search'
                type="date"
                label="End Date Time"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
        );
        case 'decade':
        return (
            <div className='date-type-search'>
                <FormControl variant="outlined" className='date-box-search'>
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
        );
      default:
        return null;
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={i === currentPage ? styles.activePage : ''}
        >
          {i}
        </button>
      );
    }

    return pageNumbers;
  };

  const handleLocationSelect = () => {
    if (!autocompleteRef.current) {
      return;
    }
  
    const place = autocompleteRef.current.getPlace();
  
    if (!place || !place.geometry || !place.geometry.location) {
      return;
    }
  
    const locationData = {
      name: place.name,
      latitude: Number(place.geometry.location.lat().toFixed(6)),
      longitude: Number(place.geometry.location.lng().toFixed(6)),
    };
  
    setLocationSearch(locationData);
    setMapCenter({ lat: locationData.latitude, lng: locationData.longitude });
  };
  useEffect(() => {
    setMarkerPosition(mapCenter);
  }, [mapCenter]);

  const handleMarker = (e) => {
    const newPosition = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    setMarkerPosition(newPosition);
    setLocationSearch({
      name: 'Custom Location',
      latitude: Number(newPosition.lat.toFixed(6)),
      longitude: Number(newPosition.lng.toFixed(6)),
    });
  };

  const renderDateDiffInput = () => {
    if (timeType === 'normal_date') {
      return (
        <div className='date-type-search'>
        <TextField 
          className='date-box-search'
          variant="outlined"
          label="Date Difference (days):"
          type="number"
          value={dateDiff}
          onChange={(e) => setDateDiff(e.target.value)}
        />
        </div>
      );
    }
    return null;
  };


  return (
    <div>
      <h2>Story Search</h2>
      <form onSubmit={handleSearch}  >
      <TextField
        variant="outlined"
        placeholder="Title"
        className='long-boxes-search'
        label="Search by Title" 
        value={titleSearch}
        onChange={(e) => setTitleSearch(e.target.value)}
      />
      <br />
      <br />
      <TextField
        variant="outlined"
        placeholder="Author"
        className='long-boxes-search'
        label="Search by Author" 
        value={authorSearch}
        onChange={(e) => setAuthorSearch(e.target.value)}
      />
      <br />
      <br />
            <TextField
        variant="outlined"
        placeholder="Tag"
        className='long-boxes-search'
        label="Search by Tag" 
        value={tagSearch}
        onChange={(e) => setTagSearch(e.target.value)}
      />
      <br />
      <div style={{ marginTop: '1rem' }}>
        <FormControl variant="outlined" > 
            <InputLabel id="date-type-label">Date Type</InputLabel>
            <Select
              labelId="date-type-label"
              placeholder = "Date Type"
              id="date-type-search"
              className='date-box-search'
              value={timeType}
              onChange={(e) => setTimeType(e.target.value)}
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
      {renderTimeInput()}
      {renderDateDiffInput()}
        <div>
            <Autocomplete 
            className='date-type-search'
            onLoad={(autocomplete) => {
              autocompleteRef.current = autocomplete;
            }}
            onPlaceChanged={handleLocationSelect}

          >
            <TextField 
              className='date-box-search'
              type="search" 
              label="Location" 
              variant="outlined" 
            />
          </Autocomplete>
          <br/>
            <FormControl>
            <InputLabel id="radiusDiff-label" style={{ marginTop: "8px" }}>Radius Difference in KM</InputLabel>
            <Slider
              aria-label="Radius Difference"
              value={radiusDiff}
              onChange={(e, value) => setRadiusDiff(value)}
              min={1}
              max={250}
              valueLabelDisplay="auto"
              style={{ width: "200px" }}
            />
          </FormControl>
        </div>
        <br/>
            <div className='search-story-map' >
                <GoogleMap
                
                mapContainerStyle={{
                  width: '400px',
                  height: '400px',
                  
                }}
                zoom={2}
                center={markerPosition}
                onClick={(e) => handleMarker(e)}
                >
                {locationSearch && (
                    <Marker
                    position={markerPosition}
                    draggable={true}
                    onDragEnd={(e) => handleMarker(e)}
                    />
                )}
                </GoogleMap>
            </div>
            <br/>
            <Button variant="contained" type="submit" className="btn btn-primary middle">Search Story</Button>
            </form> 
            {stories.length > 0 && (
  <>
    <h3>Search Results:</h3>
    <div>
      {stories.map(story => (
          <div key={story.id} className="story-box-search">
            <div className="story-details-search">
              <h3 className="story-title-search" onClick={() => handleStoryClick(story.id)}>{story.title}</h3>
              <p className="story-author-search">by {story.author_username || 'Unknown'}</p>
            </div>
          </div>
        ))}
    </div>
  </>
)}
{totalPages > 1 && (
  <div className="pagination-search">
    <Button variant="contained" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
      Previous
    </Button>
    {renderPageNumbers()}
    <Button variant="contained" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
      Next
    </Button>
  </div>
)}
    </div>
  );
};

export default withAuth(StorySearch);