// StoryMap.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { GoogleMap, Autocomplete, Marker, useJsApiLoader, DrawingManager } from '@react-google-maps/api';
import 'react-quill/dist/quill.snow.css';
import './CreateStory.css'
import { List, ListItem, ListItemText, Button, TextField } from '@mui/material';

const StoryMap = ({ mapContainerStyle, initialCenter, zoom, apiKey, onAddLocation }) => {
  const [locations, setLocations] = React.useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);
  const [drawingManager, setDrawingManager] = useState(null);
  const libraries = ['places', 'drawing'];
  const [drawnItems, setDrawnItems] = useState([]);
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries,
  });
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
    console.log("Map Clicked Location:", locationData);

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
  // Remove the location from the locations state
  setLocations(locations.filter((_, i) => i !== index));

  // Get the overlay associated with the location to be removed
  const overlayToRemove = drawnItems[index];

  // Check if the overlay exists and remove it from the map
  if (overlayToRemove) {
    overlayToRemove.setMap(null);
  }

  // Update the drawnItems state to remove the overlay reference
  setDrawnItems(drawnItems.filter((_, i) => i !== index));
};


  const handleMapLoad = (map) => {
    // Set the map instance to state if you need to access it later
    // setMapInstance(map);
    if (!window.google.maps.drawing) {
      console.error('Drawing library is not loaded');
      return;
    }

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
      // markerOptions: {
      //   icon: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
      // },
      // ... other shape options...
    });

      manager.setMap(map);
      setDrawingManager(manager);

      // Add event listener for the creation of shapes
      window.google.maps.event.addListener(manager, 'overlaycomplete', onOverlayComplete);

  };

  const onOverlayComplete = async (event) => {
    let locationData = {};
    let name = "Custom Location"; // Placeholder, prompt the user or generate as needed

    switch (event.type) {
      case 'marker':
        locationData = {
          name: name,
          latitude: event.overlay.getPosition().lat(),
          longitude: event.overlay.getPosition().lng(),
        };
        break;

      case 'polyline':
        // Taking the first point of the polyline for simplicity
        const firstPathPoint = event.overlay.getPath().getArray()[0];
        locationData = {
          name: name,
          latitude: firstPathPoint.lat(),
          longitude: firstPathPoint.lng(),
        };
        break;

      case 'rectangle':
        // A rectangle is a type of polygon that has just four sides, and the Drawing Manager
        // typically provides the bounds directly for rectangles.
        const rectBounds = event.overlay.getBounds();
        const northEast = rectBounds.getNorthEast(); // top right corner
        const southWest = rectBounds.getSouthWest(); // bottom left corner
        const rectCenterLat = (southWest.lat() + northEast.lat()) / 2;
        const rectCenterLng = (southWest.lng() + northEast.lng()) / 2;
        locationData = {
          name: name,
          latitude: rectCenterLat,
          longitude: rectCenterLng,
        };
        break;

      case 'polygon':
        // Compute the center of the polygon
        const bounds = new window.google.maps.LatLngBounds();
        event.overlay.getPath().getArray().forEach((path) => {
          bounds.extend(path);
        });
        const center = bounds.getCenter();
        locationData = {
          name: name,
          latitude: center.lat(),
          longitude: center.lng(),
        };
        break;

      case 'circle':
        locationData = {
          name: name,
          latitude: event.overlay.getCenter().lat(),
          longitude: event.overlay.getCenter().lng(),
          radius: event.overlay.getRadius(),
        };
        console.log(event.overlay.getRadius())
        break;

      default:
        console.error('Unsupported shape type:', event.type);
        return;
    }

    setDrawnItems(prevDrawnItems => [...prevDrawnItems, event.overlay]);

    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${locationData.latitude},${locationData.longitude}&key=${apiKey}`);
      const { results } = response.data;
      if (results.length > 0) {
        locationData.name = results[0].formatted_address;
      } else {
        locationData.name = 'Unnamed location'; // Fallback name
      }
    } catch (error) {
      console.error('Error fetching location name:', error);
      locationData.name = 'Unnamed location'; // Fallback name
    }

    console.log("Location Data for Backend 1:", locationData);
    // Adjusting the locationData for the backend
    let backendLocationData = {};

      switch (event.type) {
        case 'marker':
          backendLocationData = {
            name: await getLocationName(event.overlay.getPosition().lat(), event.overlay.getPosition().lng()),
            point: {
              type: 'Point',
              coordinates: [event.overlay.getPosition().lng(), event.overlay.getPosition().lat()]
            }
          };
          break;

        case 'polyline':
          backendLocationData = {
            name: await getLocationName(event.overlay.getPath().getArray()[0].lat(), event.overlay.getPath().getArray()[0].lng()),
            line: {
              type: 'LineString',
              coordinates: event.overlay.getPath().getArray().map(coord => [coord.lng(), coord.lat()])
            }
          };
          break;

        case 'rectangle':
          // Get the bounds of the rectangle
          const bounds = event.overlay.getBounds();
          const ne = bounds.getNorthEast(); // North East corner
          const sw = bounds.getSouthWest(); // South West corner

          // Create the LinearRing coordinates in the correct order
          // It's important to close the loop by repeating the first coordinate at the end.
          const rectangleCoordinates = [
            [sw.lng(), sw.lat()], // SW
            [ne.lng(), sw.lat()], // SE
            [ne.lng(), ne.lat()], // NE
            [sw.lng(), ne.lat()], // NW
            [sw.lng(), sw.lat()] // Close the loop (SW again)
          ];

          backendLocationData = {
            name: await getLocationName((ne.lat() + sw.lat()) / 2, (ne.lng() + sw.lng()) / 2),
            polygon: {
              type: 'Polygon',
              coordinates: [rectangleCoordinates] // Polygon requires an array of LinearRings
            }
          };
          break;

        case 'polygon':
          const path = event.overlay.getPath().getArray();
          const coordinates = path.map(p => [p.lng(), p.lat()]);
          // Ensure the polygon is closed by adding the first point to the end
          coordinates.push([path[0].lng(), path[0].lat()]);

          backendLocationData = {
            name: await getLocationName(path[0].lat(), path[0].lng()),
            polygon: {
              type: 'Polygon',
              coordinates: [coordinates] // Note the extra brackets indicating an array of LinearRings
            }
          };
          break;

        case 'circle':
          backendLocationData = {
            name: await getLocationName(event.overlay.getCenter().lat(), event.overlay.getCenter().lng()),
            circle: {
              type: 'Point',
              coordinates: [event.overlay.getCenter().lng(), event.overlay.getCenter().lat()]
            },
            radius: event.overlay.getRadius()
          };
          break;

        default:
          console.error('Unsupported shape type:', event.type);
          return;
      }

      console.log("Location Data for Backend:", backendLocationData);
      setLocations(prevLocations => [...prevLocations, backendLocationData]);
      onAddLocation(backendLocationData); // This function needs to be defined to handle the location addition

    };

    async function getLocationName(lat, lng) {
      try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`);
        const { results } = response.data;
        if (results.length > 0) {
          return results[0].formatted_address;
        }
        return 'Unnamed location';
      } catch (error) {
        console.error('Error fetching location name:', error);
        return 'Unnamed location';
      }
    }




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
        {/* <DrawingManager
        onOverlayComplete={onOverlayComplete}
        // ... other props for DrawingManager, like options for drawing control etc.
      /> */}
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
