'use client';


import React, { useState, useCallback, useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'

import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl; 
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon.src,
    iconRetinaUrl: markerIcon2x.src,
    shadowUrl: markerShadow.src,
});

interface MapProps {
  center?: number[]
}

const url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';


const DraggableMarker: React.FC<{ position: L.LatLngExpression, setPosition: (pos: L.LatLng) => void}> = ({ position, setPosition }) => {
  // we create a new draggable component allowing the marker to be moved 
  const markerRef = React.useRef<L.Marker>(null);

   const eventHandlers = React.useMemo(
     () => ({
       dragend() {
         const marker = markerRef.current;
         if (marker != null){
           setPosition(marker.getLatLng());
         }
       },
     }),
     [setPosition],
   );

   return (
    <Marker
        draggable={true}
        eventHandlers={eventHandlers}
        position={position}
        ref={markerRef}
    />
   );
};

const Map: React.FC<MapProps> = ({ center: initialCenter }) => {
  // this component uses state to keep track of the current center position and place the name.
  const [center, setCenter] = useState<L.LatLngExpression>(initialCenter as L.LatLngExpression || [51, -0.09]);
  const [placeName, setPlaceName] = useState<string>('');

  const handlePositionChange = useCallback(async (newPosition: L.LatLng) => {
    // this function updates the center position and fetches the place name using 
    // the Nominatim service when the marker is moved.
     setCenter([newPosition.lat, newPosition.lng]);

     // Fetch place name using Nominatim API service
     // We'll use the Nominatim service for reverse geocoding to get the place name
     try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${newPosition.lat}&lon=${newPosition.lng}`);
      const data =await response.json();
      setPlaceName(data.display_name);
     } catch (error){
        console.error('Error fetching place name:', error);
        setPlaceName('');
     }
  }, []);

  useEffect(() => {
    // hook is used to fetch the initial place name when the component mounts.
    // Fetch initial place name
    const initialLatLng = L.latLng(center);
    handlePositionChange(initialLatLng);

  }, []);
  return (
      <div>
        <MapContainer 
          center={center} 
          zoom={center ? 4 : 2} 
          scrollWheelZoom={true} 
          className="h-[35vh] rounded-lg"
        >
          <TileLayer
            url={url}
            attribution={attribution}
          />
          <DraggableMarker position={center} setPosition={handlePositionChange} />
        </MapContainer>
        {placeName && (
        <p className="mt-2">Selected location: {placeName}</p>
      )}
      </div>
  )
}

export default Map