import React, { useEffect, useState } from "react";
import MyPlace from "./MyPlace";

const MyPlaces = (props) => {
  const [places, setPlaces] = useState();
  const userId = props.userId;

  const [refreshNeeded, setRefreshNeeded] = useState(0);

  const handleRefresh = () => {
    setRefreshNeeded(refreshNeeded === 0 ? 1 : 0);
  };

  useEffect(() => {
    const fetchPlaces = async () => {
      const response = await fetch(
        `http://localhost:9000/api/v1/get-user-places/${userId}/`
      );
      const responseData = await response.json();
      setPlaces(responseData);
    };
    fetchPlaces();
  }, [refreshNeeded]);

  if (places && places.length > 0) {
    return (
      <ul>
        {places.map((place) => (
          <MyPlace
            key={`${place._id} + ${userId}`}
            id={place._id}
            image={place.image}
            name={place.name}
            summary={place.summary}
            beds={place.beds}
            url={place.listing_url}
            onRefresh={handleRefresh}
          />
        ))}
      </ul>
    );
  } else {
    return <h2>You have no places saved yet.</h2>;
  }
};

export default MyPlaces;
