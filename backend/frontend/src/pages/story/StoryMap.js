// StoryMap.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { GoogleMap, Autocomplete, Marker, useJsApiLoader, DrawingManager } from '@react-google-maps/api';
import 'react-quill/dist/quill.snow.css';
import './CreateStory.css'
import { List, ListItem, ListItemText, Button, TextField } from '@mui/material';

const StoryMap = ({ mapContainerStyle, initialCenter, zoom, apiKey, onAddLocation }) => {
  const [locations, setLocations] = React.useState([]);
  const [searchBox, setSearchBox] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);
  const [drawingManager, setDrawingManager] = useState(null);
  const [shapes, setShapes] = useState([]);
  const libraries = ['places', 'drawing'];
  const [drawnItems, setDrawnItems] = useState([]);
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries,
  });

  const convertOverlayToLocation = (overlayEvent) => {
    // Depending on the type of overlay (marker, polyline, polygon, etc.),
    // extract the relevant data and construct a location object that matches
    // the structure expected by your backend.
    // This will involve using methods like `overlayEvent.overlay.getPath().getArray()`
    // for polylines and polygons, `overlayEvent.overlay.getPosition()` for markers,
    // and so on.

    // Example for a polygon:
    if (overlayEvent.type === 'polygon') {
      const paths = overlayEvent.overlay.getPath().getArray().map(coord => ({
        latitude: coord.lat(),
        longitude: coord.lng()
      }));
      return {
        name: 'Some Name', // You might want to prompt the user for a name or generate one
        polygon: paths,
        // ... other properties as needed
      };
    }

    // ... handle other types similarly

    // Return null or an appropriate object if the overlay type is not supported
    return null;
  };

  const convertDrawingToLocation = (event) => {
    // Initialize an empty location object
    let location = {
      name: "", // Default name, you might want to allow users to edit this
      point: null,
      line: null,
      polygon: null,
      circle: null,
      radius: null,
    };

    // Check the type of overlay and create the appropriate location object
    if (event.type === 'marker') {
      // A marker is considered a point
      location.point = {
        type: "Point",
        coordinates: [event.overlay.getPosition().lng(), event.overlay.getPosition().lat()],
      };
    } else if (event.type === 'polyline') {
      // A polyline corresponds to a line
      location.line = {
        type: "LineString",
        coordinates: event.overlay.getPath().getArray().map(coord => [coord.lng(), coord.lat()]),
      };
    } else if (event.type === 'polygon') {
      // A polygon is an array of linear rings, where the first ring is the outer ring
      // and any additional rings are holes in the polygon
      location.polygon = {
        type: "Polygon",
        coordinates: [
          event.overlay.getPath().getArray().map(coord => [coord.lng(), coord.lat()])
        ],
      };
    } else if (event.type === 'circle') {
      // A circle is represented by its center point and radius
      location.circle = {
        type: "Point",
        coordinates: [event.overlay.getCenter().lng(), event.overlay.getCenter().lat()],
      };
      location.radius = event.overlay.getRadius();
    }

    // You can add additional properties to the location object if needed
    return location;
  };


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

//   const handleMapLoad = (map) => {
//     setSearchBox(new window.google.maps.places.SearchBox(map.getDiv()));
//   };

  const handleLocationRemove = (index) => {
    setLocations(locations.filter((_, i) => i !== index));
  };

  const handleMapLoad = (map) => {
    // Set the map instance to state if you need to access it later
    // setMapInstance(map);
    if (!window.google.maps.drawing) {
        console.error('Drawing library is not loaded');
        return;
      }
    // Initialize the DrawingManager after confirming the library is loaded
    if (window.google.maps.drawing) {
      const manager = new window.google.maps.drawing.DrawingManager({
        drawingMode: window.google.maps.drawing.OverlayType.MARKER,
        drawingControl: true,
        drawingControlOptions: {
          position: window.google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [
            window.google.maps.drawing.OverlayType.MARKER,
            window.google.maps.drawing.OverlayType.CIRCLE,
            window.google.maps.drawing.OverlayType.POLYGON,
            window.google.maps.drawing.OverlayType.POLYLINE,
            window.google.maps.drawing.OverlayType.RECTANGLE,
          ],
        },
        markerOptions: {
          icon: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
        },
        // ... other shape options...
      });

      manager.setMap(map);
      setDrawingManager(manager);

      // Add event listener for the creation of shapes
      window.google.maps.event.addListener(manager, 'overlaycomplete', (event) => {
        // Handle the completed overlay here
        // e.g., store it in state, send to a server, etc.
        const newShape = {
          type: event.type,
          overlay: event.overlay,
          // You can store additional properties depending on the shape type
        };

        // Add the new shape to the drawnItems state
        setDrawnItems([...drawnItems, newShape]);
      });
    } else {
      console.error('Google Maps Drawing library is not loaded.');
    }
    // Existing code to handle the SearchBox might go here
    // ...
  };
  const onOverlayComplete = (event) => {
    // Convert the drawing overlay to a location object (you'll need to define the logic)
    const location = convertDrawingToLocation(event);

    // Call the onAddLocation prop with the new location
    onAddLocation(location);
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
        <DrawingManager
        onOverlayComplete={onOverlayComplete}
        // ... other props for DrawingManager, like options for drawing control etc.
      />
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
