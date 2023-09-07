import axios from "axios";

class PlacesDataService {
  getAll(page = 0) {
    return axios.get(`http://localhost:9000/api/v1/places?page=${page}`);
  }

  get(id) {
    console.log(id);
    return axios.get(`http://localhost:9000/api/v1/places/${id}`);
  }

  find(query, by = "", page = 0) {
    return axios.get(
      `http://localhost:9000/api/v1/places?${by}=${query}&page=${page}`
    );
  }

  getBedAmounts() {
    return axios.get("http://localhost:9000/api/v1/places/bed_amounts");
  }

  getPropertyTypes() {
    return axios.get("http://localhost:9000/api/v1/places/property_types");
  }

  addToUserPlaces = async (userId, placeId) => {
    try {
      const response = await fetch(
        `http://localhost:9000/api/v1/add-to-user-places/${userId}/${placeId}`,
        {
          method: "POST",
        }
      );
    } catch (err) {
      console.log();
    }
  };

  removeFromUserPlaces = async (userId, placeId) => {
    console.log("HIT IT"); // Access response data
    try {
      const response = await fetch(
        `http://localhost:9000/api/v1/remove-from-user-places/${userId}/${placeId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const responseData = await response.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  filterSearchResults = async (filters, by = "", page) => {
    console.log(filters, page);
    try {
      const response = await fetch(
        `http://localhost:9000/api/v1/filter-places-by-search-results`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filters: filters,
            by: by,
            page: page,
          }),
        }
      );
      return response;
    } catch (err) {}
  };
}

export default new PlacesDataService();
