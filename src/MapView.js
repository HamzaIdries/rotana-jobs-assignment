import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import Geocode from "react-geocode";

const KEY = process.env.REACT_APP_GOOGLE_MAP_KEY;

Geocode.setApiKey(KEY);

async function positionFromName(name) {
    const response = await Geocode.fromAddress(name);
    return response.results[0].geometry.location;
}

async function positionsFromNames(cities) {
    return Promise.all(cities.map(positionFromName));
}

export default function MapView({ data }) {
    const [locations, setLocations] = useState([]);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: KEY
    });

    useEffect(() => {
        const cities = [...new Set(data.map(([_, location]) => location))];
        positionsFromNames(cities).then(locations => setLocations(locations));
    }, []);

    if (!isLoaded)
        return (
            <div>
                Loading...
            </div>
        );
    else
        return (
            <GoogleMap
                zoom={10}
                center={{
                    lat: 30,
                    lng: 30
                }}
                mapContainerClassName="googleMap"
            >
                {
                    locations.map(location => <Marker position={location} />)
                }
            </GoogleMap>
        );
}