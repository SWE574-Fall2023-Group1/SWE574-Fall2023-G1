// StoryMap.js
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { GoogleMap, Autocomplete, Marker, useJsApiLoader, Polygon, Polyline, Circle } from '@react-google-maps/api';
import 'react-quill/dist/quill.snow.css';
import './CreateStory.css'
import { List, ListItem, ListItemText, Button, TextField } from '@mui/material';

const StoryMap = ({ mapContainerStyle, initialCenter, zoom, apiKey, onAddLocation, onRemoveLocation, onUpdateLocations, location_ids }) => {
  const [locations, setLocations] = React.useState([]);
  // const [locations, setLocations] = React.useState(location_ids || []);
  const [editingIndex, setEditingIndex] = useState(null); // Track which location is being edited
  const [editedName, setEditedName] = useState(''); // Temporary storage for the edited name
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);
  // eslint-disable-next-line no-unused-vars
  const [drawingManager, setDrawingManager] = useState(null);
  const libraries = ['places', 'drawing'];
  const [drawnItems, setDrawnItems] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries,
  });
  useEffect(() => {
    if (location_ids && location_ids.length > 0) {
      const updatedLocations = location_ids.reduce((validLocations, location) => {
        // Check if at least one of the properties is not null
        if (location.point || location.line || location.polygon || location.circle) {
          validLocations.push(location);
        }
        return validLocations;
      }, []);
      setLocations(updatedLocations);
    }
  }, [location_ids]);

  function NewStoryMarkers({ locations }) {
    return (
      <>
        {locations.map((location, index) => {
          if (location.point) {
            // For Point type locations
            return (
              <Marker
                key={index}
                position={{ lat: location.point.coordinates[1], lng: location.point.coordinates[0] }}
              />
            );
          } else if (location.line) {
            // For LineString type locations
            const path = location.line.coordinates.map(coord => ({ lat: coord[1], lng: coord[0] }));
            return (
              <Polyline
                key={index}
                path={path}
                options={{ strokeColor: "#FF0000" }}
              />
            );
          } else if (location.polygon) {
            // For Polygon type locations
            const paths = location.polygon.coordinates.map(polygon =>
              polygon.map(coord => ({ lat: coord[1], lng: coord[0] }))
            );
            return (
              <Polygon
                key={index}
                paths={paths}
                options={{ fillColor: "#FFFF00" }}
              />
            );
          } else if (location.circle) {
            // For Circle type locations
            return (
              <Circle
                key={index}
                center={{ lat: location.circle.coordinates[1], lng: location.circle.coordinates[0] }}
                radius={parseFloat(location.radius)}
                options={{ fillColor: "#0088FF" }}
              />
            );
          } else {
            // If the location type is not recognized
            return null;
          }
        })}
      </>
    );
  }

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
        console.log("Adding new location (Create Part):", locationData);  // Log the new location being added

        setLocations([...locations, locationData]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditedName(locations[index].name);
  };

  const handleSaveClick = (index) => {
    const updatedLocations = locations.map((location, locIndex) => {
      if (index === locIndex) {
        return { ...location, name: editedName };
      }
      return location;
    });
    setLocations(updatedLocations);
    setEditingIndex(null); // Exit editing mode

    // Call the onAddLocation prop with the updated locations array
    onUpdateLocations(updatedLocations);
  };

  const handleSelect = () => {
    if (!autocompleteRef.current) {
      return;
    }

    const place = autocompleteRef.current.getPlace();

    if (!place || !place.geometry || !place.geometry.location) {
      return;
    }

    // Create a new location object with the name and coordinates
    const newLocation = {
      name: place.name,
      point: {
        type: 'Point',
        coordinates: [
          Number(place.geometry.location.lng().toFixed(6)),
          Number(place.geometry.location.lat().toFixed(6))
        ]
      },
      latitude: Number(place.geometry.location.lat().toFixed(6)),
      longitude: Number(place.geometry.location.lng().toFixed(6))
    };

    // Update the locations state with the new location
    setLocations(prevLocations => {
      const updatedLocations = [...prevLocations, newLocation];
      console.log("New locations array:", updatedLocations); // This should log the updated array
      return updatedLocations;
    });

    // Update the map center to the new location
    setMapCenter({
      lat: newLocation.latitude,
      lng: newLocation.longitude
    });

    // Clear the input field after selecting a place
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    // If there's a callback for adding a new location, call it
    if (onAddLocation) {
      onAddLocation(newLocation);
    }
  };



//   const handleMapLoad = (map) => {
//     setSearchBox(new window.google.maps.places.SearchBox(map.getDiv()));
//   };

  const handleLocationRemove = (index) => {
    // Remove the visual marker or overlay from the map
    const overlayToRemove = drawnItems[index];
    if (overlayToRemove) {
      overlayToRemove.setMap(null); // This should remove the overlay from the map
    }

    // Update the drawnItems and locations state to reflect the removal
    const updatedDrawnItems = drawnItems.filter((_, i) => i !== index);
    const updatedLocations = locations.filter((_, i) => i !== index);

    setDrawnItems(updatedDrawnItems);
    setLocations(updatedLocations);
    onRemoveLocation(index);

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

    useEffect(() => {
      console.log("Initial locations received in StoryMap:", location_ids);
    }, [location_ids]);

    useEffect(() => {
      console.log("Updated locations in StoryMap:", locations);
    }, [locations]);


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
          <br/>
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
        <NewStoryMarkers locations={locations} />

      </GoogleMap>
      <List>
        {locations.map((location, index) => (
          <ListItem key={index}>
            {editingIndex === index ? (
              <TextField
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                style={{ marginRight: "16px" }}
              />
            ) : (
              <ListItemText style={{ marginRight: "16px" }}>
                {location.name || `${location.latitude}, ${location.longitude}`}
              </ListItemText>
            )}
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={() => (editingIndex === index ? handleSaveClick(index) : handleEditClick(index))}
            >
              {editingIndex === index ? 'Save' : 'Edit'}
            </Button>
            <Button
              variant="contained"
              size="small"
              color="secondary"
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
