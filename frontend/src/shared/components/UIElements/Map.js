import React, { useRef, useEffect } from "react";

import "./Map.css";

const Map = (props) => {
  const mapRef = useRef();

  const zoom = props.zoom;

  var lat = parseFloat(props.center[1]);
  var lng = parseFloat(props.center[0]);

  const centerToFloat = { lat, lng };

  console.log(typeof centerToFloat);

  useEffect(() => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: {
        lat: lat,
        lng: lng,
      },
      zoom: zoom,
    });

    new window.google.maps.Marker({
      position: {
        lat: lat,
        lng: lng,
      },
      map: map,
    });
  }, [centerToFloat, zoom]);

  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
    ></div>
  );
};

export default Map;
