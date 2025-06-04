import React, {useState, useEffect, use} from 'react';
import {GoogleMap, useLoadScript, Marker, Autocomplete} from '@react-google-maps/api';
import { FaMapMarkerAlt } from 'react-icons/fa';
import './helper-css/map.css';
import {useAuth} from "react-oidc-context";

const libraries = ["places"];
const mapContainerStyle = {
  width: '70%',
  height: '200px',
};

const defaultCenter = {
    lat: 39.8283, // Default latitude
    lng: -98.5795, // Default longitude
};

function MapComponent() {
    const {isLoaded, loadError} = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const [userLocation, setUserLocation] = useState(null);
    const [autocomplete, setAutocomplete] = useState(null);
    const [formattedAddress, setFormattedAddress] = useState('');
    const [showMap, setShowMap] = useState(false);

    const onLoad = (autoC) => {
        setAutocomplete(autoC);
    };

    const onPlaceChanged = () => {
        if (autocomplete !== null){
            const place = autocomplete.getPlace();

            if(!place.geometry || !place.geometry.location){
                console.log("No details available for input: ' ", place.name+ "'");
                return;
            }
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            const address = place.formatted_address;

            setUserLocation({ lat, lng });
            setFormattedAddress(address);
            console.log("Selected address:", address);
            console.log("Selected coordinates:", { lat, lng });

            //TODO: Save the address and coordinates to the database

        } else {
            console.log("Autocomplete is not loaded yet!");
        }


    };

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            (error) => {
                console.error("Error getting user location:", error);
            }   
        );
    }, []);

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading Maps...</div>;

    return (

        <div className="position-toggle-btn">
            {/* Location Pin Icon Button */}
            <button
                className="map-toggle-button"
                onClick={() => setShowMap(!showMap)}
            >
                <FaMapMarkerAlt title={showMap ? "Hide Map": "Show Map"}/>
            </button>
            {showMap && (
                <div>
                <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                    <input
                        type="text"
                        placeholder="My neighborhood"
                        className="bold-placeholder"
                        style={{
                            width: '60%',
                            padding: '12px',
                            fontSize: '16px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            margin: '10px auto',
                        }}
                    />
                </Autocomplete>
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    zoom={12}
                    center={userLocation || defaultCenter}
                    >
                        {userLocation && <Marker position={userLocation} />}
                </GoogleMap>

                {formattedAddress && (
                    <div style={{ marginTop: '10px', fontSize: 'italic' }}>
                        <strong>Selected Address:</strong> {formattedAddress}
                    </div>
                )}
                </div>
            )}
        </div>
    );
}

export default MapComponent;