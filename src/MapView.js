import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader, DistanceMatrixService, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';

function MapView({ id, height, width, center, markers }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyCxgIpUxXWnLWZylADZ5GNH7kvmBZEa5rs"
  })

  const [map, setMap] = useState(null)
  const [activeMarker, setActiveMarker] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [directions, setDirections] = useState(null);

  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    markers.forEach(({ position }) => bounds.extend(position));
    map.fitBounds(bounds);
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  const getDirections = () => {
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route({
      origin: markers.find(item => item.id === origin).position, 
      destination: markers.find(item => item.id === destination).position, 
      travelMode: window.google.maps.TravelMode.DRIVING
    }, (result, status) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        setDirections(result)
      } else {
        console.error('error fetching directions', result);
      }
    });
  }

  let originMarker = markers.find(item => item.id === origin),
    destinationMarker = markers.find(item => item.id === destination);

  return isLoaded ? (
    <div>
      <p>Origin: {originMarker?.name}</p>
      <p>Destination: {destinationMarker?.name}</p>
      <p><button onClick={getDirections}>Get Direction</button></p>
      <GoogleMap
        id={id} center={center} zoom={8}
        mapContainerStyle={{ height, width }}
        onClick={() => setActiveMarker(null)}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        <DirectionsRenderer
          directions={directions}
        />
        {/* <DistanceMatrixService
        options={{
          destinations: [
            { lat: 26.81831, lng: 87.05917},
            { lat: 26.8022442, lng: 85.9595911},
            { lat: 27.11667, lng: 84.9536},
          ],
          origins: [
            { lng: 87.8397, lat: 26.6288 },
          ],
          travelMode: "DRIVING",
        }}
        callback={(response) => { console.log(response) }}
      /> */}
        {markers.map(({ id, name, position }) => (
          <Marker
            key={id}
            position={position}
            onClick={() => handleActiveMarker(id)}
          >
            {activeMarker === id ? (
              <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                <div>
                  <p>{name}</p>
                  <button onClick={() => setOrigin(id)}>Set Origin</button>
                  <button onClick={() => setDestination(id)}>Set Destination</button>
                </div>
              </InfoWindow>
            ) : null}
          </Marker>
        ))}
      </GoogleMap>
    </div>
  ) : <></>
}

export default MapView;