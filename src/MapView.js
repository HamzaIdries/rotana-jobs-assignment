import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import { useMemo } from "react";

const KEY = process.env.REACT_APP_GOOGLE_MAP_KEY;

export default function MapView({ data }) {
    const center = useMemo(() => ({lat: 27, lng: 42.5}), []);
    const zoom = useMemo(() => 5.5, []);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: KEY
    });

    if (!isLoaded) return (<div>Loading...</div>);
    else return (
        <GoogleMap
            zoom={zoom}
            center={center}
            mapContainerClassName="googleMap"
        >
            {
                data.map(
                    ({latLng}, i) => <MarkerF key={i} position={latLng} />
                )
            }
        </GoogleMap>
    );
}