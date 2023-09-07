const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;

const getDb = require("../util/database").getDb;

let places;

class PlacesDAO {
  static async injectDB() {
    const db = getDb();
    if (places) {
      return;
    }
    try {
      places = await db.collection("listingsAndReviews");
    } catch (e) {
      console.error(`Unable to connect: ${e}`);
    }
  }
  static async getPlaces({
    filters = null,
    page = 0,
    placesPerPage = 20,
  } = {}) {
    let query;
    if (filters) {
      if ("beds" in filters) {
        query = { beds: { $eq: filters["beds"] } };
        console.log(filters);
      } else if ("property_type" in filters) {
        query = { property_type: { $eq: filters["property_type"] } };
        console.log(filters);
      }
    }
    let cursor;
    try {
      cursor = places
        .find(query)
        .limit(placesPerPage)
        .skip(placesPerPage * page);

      const placesList = await cursor.toArray();
      const totalNumPlaces = await places.countDocuments(query);
      return { placesList, totalNumPlaces };
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { placesList: [], totalNumPlaces: 0 };
    }
  }
  static async getPropertyTypes() {
    let propertyTypes = [];
    try {
      propertyTypes = await places.distinct("property_type");
      return propertyTypes;
    } catch (e) {
      console.error(`Unable to get property type ${e}`);
      return propertyTypes;
    }
  }

  static async getBedAmounts() {
    let bedAmounts = [];
    try {
      bedAmounts = await places.distinct("beds");
      return bedAmounts;
    } catch (e) {
      console.error(`Unable to get bed amounts ${e}`);
      return bedAmounts;
    }
  }

  static async getPlaceById(id) {
    console.log("Hit getPlaceById");
    console.log;
    try {
      const foundplace = await places.findOne({ _id: String(id) });
      return foundplace;
    } catch (e) {
      console.error(`Something went wrong in getPlaceById: ${e}`);
      throw e;
    }
  }
  static async filterSearchResults({
    queryParameters = null,
    page = page,
    placesPerPage = 5,
  } = {}) {
    let query;
    if (queryParameters) {
      if (queryParameters["beds"] && !queryParameters["property_type"]) {
        query = { beds: { $eq: queryParameters["beds"] } };
        console.log(queryParameters);
      } else if (!queryParameters["beds"] && queryParameters["property_type"]) {
        query = { property_type: { $eq: queryParameters["property_type"] } };
        console.log(queryParameters);
      } else if (queryParameters["beds"] && queryParameters["property_type"]) {
        query = {
          beds: { $eq: queryParameters["beds"] },
          property_type: { $eq: queryParameters["property_type"] },
        };
      }
      let cursor;
      try {
        cursor = places
          .find(query)
          .limit(placesPerPage)
          .skip(placesPerPage * page);

        const placesList = await cursor.toArray();
        const totalNumPlaces = await places.countDocuments(query);
        return { placesList, totalNumPlaces };
      } catch (e) {
        console.error(`Unable to issue find command, ${e}`);
        return { placesList: [], totalNumPlaces: 0 };
      }
    }
  }
}
module.exports = PlacesDAO;
