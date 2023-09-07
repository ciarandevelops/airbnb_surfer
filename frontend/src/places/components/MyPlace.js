import React, { useContext } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Container";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import Button from "../../shared/components/FormElements/Button";
import PlacesDataService from "../../services/PlacesDataService";
import { AuthContext } from "../../shared/context/auth-context";
import "./MyPlaceItem.css";

const MyPlaceItem = (props) => {
  const auth = useContext(AuthContext);

  const userId = auth.userId;
  const placeId = props.id;

  const triggerRefresh = () => {
    props.onRefresh();
  };

  const removeFromMyPlacesHandler = async () => {
    await PlacesDataService.removeFromUserPlaces(userId, placeId);

    triggerRefresh();
  };

  return (
    <div>
      <Container>
        <Row>
          <Col>
            <Card>
              <div>
                <Image src={props.image} thumbnail />
              </div>
              <Card.Header as="h3">
                <a
                  href={`${props.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {props.name}
                </a>
              </Card.Header>
              <Card.Body>
                <Card.Text>{props.summary}</Card.Text>
                <Card.Text>Beds: {props.beds}</Card.Text>
              </Card.Body>
              <Button onClick={removeFromMyPlacesHandler}>
                Remove From My Places
              </Button>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MyPlaceItem;
