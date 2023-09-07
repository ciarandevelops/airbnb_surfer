import React, { useState, useEffect, useCallback } from "react";
import PlacesDataService from "../../services/PlacesDataService";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Container";
import Container from "react-bootstrap/Container";
import PlaceItem from "./PlaceItem";
import Card from "../../shared/components/UIElements/Card";

import "./PlacesList.css";

const PlacesList = () => {
  const [places, setPlaces] = useState([]);
  const [searchPropertyType, setSearchPropertyType] = useState("");
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [searchBedAmount, setSearchBedAmount] = useState("");
  const [bedAmounts, setBedAmounts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [entriesPerPage, setEntriesPerPage] = useState(0);
  const [filters, setFilters] = useState("");
  const [currentSearchMode, setCurrentSearchMode] = useState("");
  const [headerState, setHeaderState] = useState("Check out our great places!");
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const filterSearchResults = async () => {
    try {
      const response = await PlacesDataService.filterSearchResults(
        filters,
        "",
        currentPage
      );
      const responseData = await response.json();
      setPlaces(responseData.places);
      setEntriesPerPage(responseData.entries_per_page);
    } catch (e) {
      console.log(e);
    }
  };

  const setHeader = () => {
    console.log("HIT Set Header");
    console.log(places);
    if (places && places.length == 0) {
      setHeaderState("We have no options available for your selection");
    } else {
      setHeaderState("Check out our great places");
    }
  };

  const refreshSearchResults = () => {
    setCurrentPage(0);
    filterSearchResults();
  };

  useEffect(() => {
    if (initialLoadComplete && places) {
      setHeader();
    } else {
      setInitialLoadComplete(true);
    }
  }, [places]);

  useEffect(() => {
    setFilters({ property_type: searchPropertyType, beds: searchBedAmount });
  }, [searchBedAmount, searchPropertyType]);

  useEffect(() => {
    filterSearchResults();
    retrievePropertyTypes();
    retrieveBedAmounts();
  }, [currentPage]);

  const retrieveNextPage = () => {
    setCurrentPage(currentPage + 1);
    filterSearchResults();
  };

  const retrievePreviousPage = () => {
    setCurrentPage(currentPage - 1);
    filterSearchResults();
  };

  const retrievePropertyTypes = () => {
    PlacesDataService.getPropertyTypes()
      .then((response) => {
        setPropertyTypes(["All Property Types"].concat(response.data));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const retrieveBedAmounts = () => {
    PlacesDataService.getBedAmounts()
      .then((response) => {
        setBedAmounts(["All Bed Amounts"].concat(response.data));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const onChangeSearchPropertyType = (e) => {
    if (e.target.value != "All Property Types") {
      const changedSearchPropertyType = e.target.value;
      setSearchPropertyType(changedSearchPropertyType);
    } else {
      setSearchPropertyType("");
    }
  };

  const onChangeSearchBeds = (e) => {
    const changedBedAmount = e.target.value;
    setSearchBedAmount(changedBedAmount);
  };

  return (
    <div className="App">
      <Container>
        <h1>{headerState}</h1>
        <Form>
          <Row>
            <Col>
              <Form.Group>
                <select
                  className="custom-select"
                  onChange={onChangeSearchPropertyType}
                >
                  {propertyTypes.map((propertyType) => {
                    return (
                      <option key={propertyType} value={propertyType}>
                        {propertyType}
                      </option>
                    );
                  })}
                </select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group>
                <select className="custom-select" onChange={onChangeSearchBeds}>
                  {bedAmounts.map((bedAmount) => {
                    return (
                      <option key={bedAmount} value={bedAmount}>
                        {bedAmount}
                      </option>
                    );
                  })}
                </select>
              </Form.Group>
              <Button
                className="search-button"
                variant="primary"
                type="button"
                onClick={refreshSearchResults}
              >
                Search
              </Button>
            </Col>
          </Row>
        </Form>
        <ul className="place-list">
          {places.map((place) => (
            <Card className="place-item-list-card">
              <PlaceItem
                key={place._id}
                id={place._id}
                image={place.images.picture_url}
                name={place.name}
                summary={place.summary}
                beds={place.beds}
                coordinates={place.address.location.coordinates}
                address={`${place.address.suburb}` + `${place.address.street}`}
              />
            </Card>
          ))}
        </ul>
        Showing page: {currentPage}
        <Button variant="link" onClick={retrievePreviousPage}>
          Get previous 5 results
        </Button>
        <Button variant="link" onClick={retrieveNextPage}>
          Get next 5 results
        </Button>
      </Container>
    </div>
  );
};

export default PlacesList;
