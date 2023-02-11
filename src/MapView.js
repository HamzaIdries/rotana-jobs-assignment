import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";

const KEY = process.env.REACT_APP_GOOGLE_MAP_KEY;

export default function MapView({ data }) {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: KEY
    });

    if (!isLoaded) return (<div>Loading...</div>);
    else return (
        <GoogleMap
            zoom={10}
            center={{
                lat: 30,
                lng: 30
            }}
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