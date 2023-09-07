import React, { useState, useContext, useEffect } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Container";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import Button from "../../shared/components/FormElements/Button";
import PlacesDataService from "../../services/PlacesDataService";
import { AuthContext } from "../../shared/context/auth-context";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/Map";
import CustomAlert from "../../shared/components/UIElements/CustomAlert";

import "./PlaceItem.css";

const PlaceItem = (props) => {
  const [showMap, setShowMap] = useState(false);
  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);

  const auth = useContext(AuthContext);

  const userId = auth.userId;
  const placeId = props.id;

  const [showAlert, setShowAlert] = useState(false);

  const handleShowAlert = () => {
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const addToMyPlacesHandler = async () => {
    try {
      await PlacesDataService.addToUserPlaces(userId, placeId);
      handleShowAlert();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={10}></Map>
        </div>
      </Modal>
      <Container>
        <Row>
          <Col>
            <Card>
              <div id="place-item-image-div">
                <Image src={props.image} thumbnail />
              </div>
              <Card.Header as="h3">{props.name}</Card.Header>
              <Card.Body>
                <Card.Text>{props.summary}</Card.Text>
                <Card.Text style={{ fontWeight: "bold" }}>
                  Beds: {props.beds}
                </Card.Text>
              </Card.Body>
              <Button onClick={addToMyPlacesHandler}>ADD TO MY PLACES</Button>
              {showAlert && (
                <CustomAlert
                  message="Added to your places!"
                  onClose={handleCloseAlert}
                />
              )}
              <Button inverse onClick={openMapHandler}>
                VIEW ON MAP
              </Button>
            </Card>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default PlaceItem;
