import React, {useState, useEffect} from 'react';
import {GoogleMap, useLoadScript, Marker, Autocomplete} from '@react-google-maps/api';
import { FaMapMarkerAlt } from 'react-icons/fa';
import {useAuth} from "react-oidc-context";
import './helper-css/map.css';
//import {useAuth} from "react-oidc-context";

const libraries = ["places"];


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
    const [pendingAddress, setPendingAddress] = useState(null);
    const [showMap, setShowMap] = useState(false);

    const auth = useAuth();
    const userSub = auth?.user?.profile?.sub;

    const onLoad = (autoC) => {
        setAutocomplete(autoC);
    };

    const onPlaceChanged = async () => {
        if (autocomplete !== null){
            const place = autocomplete.getPlace();
            
            if(!place.geometry || !place.geometry.location){
                console.log("No details available for input: ' ", place.name+ "'");
                return;
            }
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            const address = place.name || place.formatted_address || "Unknown location";

            setPendingAddress({ lat, lng, address });
            console.log("Pending  address:", {lat, lng, address});
        }
            
        else {
            console.log("Autocomplete is not loaded yet!");
        }

    };

    //TODO: Save the address and coordinates to the database

    const handleConfirmClick = async () => {
        if(!pendingAddress || !userSub){
            console.log("Missing location or userSub");
            return;
        }

        const {lat, lng, address}= pendingAddress;
        try{
            const response = await fetch("http://127.0.0.1:8000/save-location", {
                method: "POST",
                headers: {
                    "Content-type" : "application/json",
                },
                body: JSON.stringify({
                    user_id: userSub,
                    latitude: lat,
                    longitude: lng,
                    location_name: address
                }),
            });

            if (!response.ok){
                throw new Error("Failed to save location");
            }

            const data = await response.json;
            console.log("Saved Successfully", data);
        } catch (err) {
            console.log("Error posting location to Database:", err)
        }

    }

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

        <div className="map-component">
            {/* Location Pin Icon Button */}
            <button
                className="map-toggle-btn"
                onClick={() => setShowMap(!showMap)}
            >
                <FaMapMarkerAlt title={showMap ? "Hide Map": "Show Map"}/>
            </button>
            {showMap && (
                <div className="map-container">
                    <div className="map-container-position">
                        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                            <input
                                type="text"
                                placeholder="My neighborhood"
                                className="bold-placeholder"
                                
                            />
                        </Autocomplete>
                        
                        <GoogleMap
                            mapContainerClassName="google-map"
                            zoom={12}
                            center={userLocation || defaultCenter}
                            >
                                {userLocation && <Marker position={userLocation} />}
                        </GoogleMap>
                    
                    </div>
                    <button className="confirm-location-btn" onClick={handleConfirmClick}>
                            Confirm
                    </button>
                </div>
            
            )}
        </div>
    );
}

export default MapComponent;