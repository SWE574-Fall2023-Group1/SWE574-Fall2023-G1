// StoryMap.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { GoogleMap, Autocomplete, Marker } from '@react-google-maps/api';
import 'react-quill/dist/quill.snow.css';
import './CreateStory.css'
import { List, ListItem, ListItemText, Button, TextField } from '@mui/material';

const StoryMap = ({ mapContainerStyle, initialCenter, zoom, apiKey }) => {
  const [locations, setLocations] = React.useState([]);
  const [searchBox, setSearchBox] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);



  const handleMapClick = async (e) => {
    const { latLng } = e;
    const lat = latLng.lat();
    const lng = latLng.lng();
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`);
      const { results } = response.data;
      if (results.length > 0) {
        const locationData = {
          name: results[0].formatted_address,
          latitude: Number(lat.toFixed(6)),
          longitude: Number(lng.toFixed(6))
        };
        setLocations([...locations, locationData]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelect = () => {
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
    setLocations([...locations, locationData]);
    setMapCenter({ lat: locationData.latitude, lng: locationData.longitude });

    // Clear the input value
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleMapLoad = (map) => {
    setSearchBox(new window.google.maps.places.SearchBox(map.getDiv()));
  };

  const handleLocationRemove = (index) => {
    setLocations(locations.filter((_, i) => i !== index));
  };


  return (
    <>
    <Autocomplete
            className='date-type'
            onLoad={(autocomplete) => {
              autocompleteRef.current = autocomplete;
            }}
            onPlaceChanged={handleSelect}
          >
            <TextField
              className='date-box'
              type="search"
              label="Locations"
              variant="outlined"
              inputRef={inputRef}
            />
          </Autocomplete>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={initialCenter}
        zoom={zoom}
        onLoad={handleMapLoad}
        onClick={handleMapClick}
      >
        {locations.map((location, index) => (
          <Marker key={index} position={{ lat: location.latitude, lng: location.longitude }} />
        ))}
      </GoogleMap>
      <List>
        {locations.map((location, index) => (
          <ListItem key={index}>
            <ListItemText style={{ marginRight: "16px" }}>
              {location.name || `${location.latitude}, ${location.longitude}`}
            </ListItemText>
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={() => handleLocationRemove(index)}
            >
              Remove
            </Button>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default StoryMap;
