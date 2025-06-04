import React, {useState, useEffect} from 'react';
import {GoogleMap, useLoadScript, Marker, Autocomplete} from '@react-google-maps/api';
import {useAuth} from "react-oidc-context";

const libraries = ["places"];
const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
    lat: 39.8283, // Default latitude
    lng: -98.5795, // Default longitude
};

function MapComponent() {
    console.log("Google Maps API Key:", process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
    const {isLoaded, loadError} = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const [userLocation, setUserLocation] = useState(null);
    const [autocomplete, setAutocomplete] = useState(null);
    const [formattedAddress, setFormattedAddress] = useState('');

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

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading Maps...</div>;

    return (

        <div>
            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                <input
                    type="text"
                    placeholder="Search for a place"
                    style={{
                        width: '90%',
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
    );
}

export default MapComponent;