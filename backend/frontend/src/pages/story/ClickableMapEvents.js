import React from 'react';
import { useMapEvents } from 'react-leaflet';

const ClickableMapEvents = ({ onMapClick }) => {
    useMapEvents({
        click: onMapClick
    });

    return null;
}

export default ClickableMapEvents;
