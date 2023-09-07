const express = require("express");
const router = express.Router();

const PlacesController = require("../controllers/PlacesController");

router
  .route("/places/property_types")
  .get(PlacesController.apiGetPropertyTypes);

router.route("/places/bed_amounts").get(PlacesController.apiGetBedAmounts);

router
  .route("/add-to-user-places/:userId/:placeId")
  .post(PlacesController.apiAddPlaceToUserPlaces);

router
  .route("/remove-from-user-places/:userId/:placeId")
  .delete(PlacesController.apiRemoveFromUserPlaces);

router.get("/places/get-by-id/:id", PlacesController.apiGetPlaceById);
router.get("/get-user-places/:userId", PlacesController.apiGetUserPlaces);

router.post(
  "/filter-places-by-search-results",
  PlacesController.apiFilterSearchResults
);

module.exports = router;
