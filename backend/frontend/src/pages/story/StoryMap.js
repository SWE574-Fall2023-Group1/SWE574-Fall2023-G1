import React, { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import L from 'leaflet';
import ClickableMapEvents from './ClickableMapEvents';  // Assuming you'll also extract this to its own file
import LeafletSearchControl from './LeafletSearchControl'; // Assuming you'll also extract this to its own file

const StoryMap = ({ isComponentMounted, mapCenter, locations, handleMapClick, handleSearchMapClick, handleLocationRemove }) => {
    const icon = new L.Icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    return (
        <div className='create-story-map'>
            {isComponentMounted && (
                <MapContainer
                    center={mapCenter}
                    zoom={2}
                    style={{ height: '400px', width: '400px' }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {locations.map((loc, index) => (
                        <Marker key={index} position={[loc.geometry.coordinates[1], loc.geometry.coordinates[0]]} icon={icon}>
                            <Popup>{loc.properties.name || `${loc.geometry.coordinates[1]}, ${loc.geometry.coordinates[0]}`}</Popup>
                        </Marker>
                    ))}
                    <ClickableMapEvents onMapClick={handleMapClick} />
                    <LeafletSearchControl onSearchMapClick={handleSearchMapClick} />
                </MapContainer>
            )}
        </div>
    );
}

export default StoryMap;
