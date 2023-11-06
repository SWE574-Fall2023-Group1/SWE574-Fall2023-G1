import React, { useRef, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-search/dist/leaflet-search.min.css';
import 'leaflet-search';

const LeafletSearchControl = ({ onSearchMapClick }) => {
    const map = useMap();
    const searchControlRef = useRef(null);

    if (map && !searchControlRef.current) {
        searchControlRef.current = new L.Control.Search({
            url: 'https://nominatim.openstreetmap.org/search?format=json&q={s}',
            jsonpParam: 'json_callback',
            propertyName: 'display_name',
            propertyLoc: ['lat', 'lon'],
            marker: false,
            autoCollapse: true,
            autoType: false,
            minLength: 2,
        });

        searchControlRef.current.on('search:locationfound', async (e) => {
            console.log("search:locationfound triggered", e);
            await onSearchMapClick(e.latlng);
        });

        searchControlRef.current.addTo(map);
    }

    useEffect(() => {
        return () => {
            if (searchControlRef.current) {
                searchControlRef.current.off('search:locationfound');
                searchControlRef.current.remove();
            }
        };
    }, [map]);

    return null;
}

export default LeafletSearchControl;
