const mongodb = require("mongodb");
const PlacesDAO = require("../dao/PlacesDAO");
const User = require("../models/user");
const ObjectId = mongodb.ObjectId;
const getDb = require("../util/database").getDb;

const apiGetPlaces = async (req, res, next) => {
  const placesPerPage = req.query.placesPerPage
    ? parseInt(req.query.placesPerPage)
    : 5;
  const page = req.query.page ? parseInt(req.query.page) : 0;

  let filters = {};
  if (
    req.query.property_type &&
    req.query.property_type != "All Property Types"
  ) {
    console.log(req.query.property_type);
    filters.property_type = req.query.property_type;
  } else if (req.query.beds && req.query.beds != "All Bed Amounts") {
    console.log(req.query.beds);
    filters.beds = parseInt(req.query.beds);
  }

  const { placesList, totalNumPlaces } = await PlacesDAO.getPlaces({
    filters,
    page,
    placesPerPage,
  });

  let response = {
    places: placesList,
    page: page,
    filters: filters,
    entriesPerPage: placesPerPage,
    totalResults: totalNumPlaces,
  };
  res.json(response);
};

const apiGetPlaceById = async (req, res, next) => {
  try {
    let id = req.params.id || {};
    let place = await PlacesDAO.getPlaceById(id);
    if (!place) {
      res.status(404);
      res.json({ error: "not found" });
      return;
    }
    res.json(place);
  } catch (e) {
    console.log(`api, ${e}`);
    res.status(500);
    res.json({ error: e });
  }
};

const apiGetPropertyTypes = async (req, res, next) => {
  try {
    let propertyTypes = await PlacesDAO.getPropertyTypes();
    res.json(propertyTypes);
  } catch (e) {
    console.log(`api, ${e}`);
    res.status(500).json({ error: e });
  }
};

const apiGetBedAmounts = async (req, res, next) => {
  try {
    let bedAmounts = await PlacesDAO.getBedAmounts();
    res.json(bedAmounts);
  } catch (e) {
    console.log(`api, ${e}`);
    res.status(500).json({ error: e });
  }
};

const apiAddPlaceToUserPlaces = async (req, res, next) => {
  const userId = req.params.userId;
  const placeId = req.params.placeId;

  try {
    const user = await User.findById(ObjectId(userId));
    console.log(user);
    if (!user.places.includes(placeId)) {
      let newUserPlaces = [Number(placeId), ...user.places];
      console.log(newUserPlaces);
      user.places = newUserPlaces;
      user.save();
    } else {
      console.log("Couldn't add the item to the array, its already included.");
    }
    const jsonString = '{"message": "Request complete!"}';
    // Send the JSON string as a response
    res.json(JSON.parse(jsonString));
  } catch (err) {
    console.log(err);
  }
};

const apiRemoveFromUserPlaces = async (req, res, next) => {
  const userId = req.params.userId;
  const placeId = req.params.placeId;

  console.log(req.headers);
  try {
    const user = await User.findById(ObjectId(userId));
    console.log(user);
    if (user.places.includes(Number(placeId))) {
      let newUserPlaces = [...user.places];
      for (var i = newUserPlaces.length - 1; i >= 0; i--) {
        if (newUserPlaces[i] === Number(placeId)) {
          console.log(true);
          console.log(i);
          console.log(newUserPlaces.indexOf(Number(placeId)));
          newUserPlaces.splice(i, 1);
        }
        console.log(newUserPlaces);
        user.places = newUserPlaces;
        await user.save();
      }
    }
    const jsonString = '{"message": "Request complete!"}';
    res.json(JSON.parse(jsonString));
  } catch (err) {
    console.log(err);
  }
};

const apiGetUserPlaces = async (req, res, next) => {
  const userId = req.params.userId;
  const user = await User.findById(ObjectId(userId));
  console.log(user);
  const userPlaceIds = [...user.places];
  const promises = userPlaceIds.map(async (id) => {
    const userPlace = PlacesDAO.getPlaceById(id);
    return userPlace;
  });
  const userPlaces = await Promise.all(promises);
  res.json(userPlaces);
};

const apiFilterSearchResults = async (req, res, next) => {
  console.log(req.body);
  const placesPerPage = req.query.placesPerPage
    ? parseInt(req.query.placesPerPage)
    : 5;
  const page = req.body.page ? parseInt(req.body.page) : 0;

  let queryParameters = {};
  try {
    if (req.body.filters.property_type && req.body.filters.beds) {
      queryParameters.property_type = req.body.filters.property_type;
      queryParameters.beds = parseInt(req.body.filters.beds);
    } else if (!req.body.filters.property_type && req.body.filters.beds) {
      queryParameters.beds = parseInt(req.body.filters.beds);
    } else if (req.body.filters.property_type && !req.body.filters.beds) {
      queryParameters.property_type = req.body.filters.property_type;
    }
  } catch (err) {
    console.log(err);
  }
  const { placesList, totalNumPlaces } = await PlacesDAO.filterSearchResults({
    queryParameters,
    page,
    placesPerPage,
  });
  try {
    let response = {
      places: placesList,
      page: page,
      filters: queryParameters,
      entriesPerPage: placesPerPage,
      totalResults: totalNumPlaces,
    };

    res.json(response);
  } catch (err) {
    console.log(err);
  }
};

exports.apiGetPlaces = apiGetPlaces;
exports.apiGetPlaceById = apiGetPlaceById;
exports.apiGetPropertyTypes = apiGetPropertyTypes;
exports.apiGetBedAmounts = apiGetBedAmounts;
exports.apiAddPlaceToUserPlaces = apiAddPlaceToUserPlaces;
exports.apiGetUserPlaces = apiGetUserPlaces;
exports.apiRemoveFromUserPlaces = apiRemoveFromUserPlaces;
exports.apiFilterSearchResults = apiFilterSearchResults;
