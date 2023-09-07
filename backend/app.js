const express = require("express");
const PlacesDAO = require("./dao/PlacesDAO");
const mongoose = require("mongoose");

const app = express();
const mongoConnect = require("./util/database").mongoConnect;
const cors = require("cors");
const User = require("./models/user");
const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const path = require("path");
const accessString = require("./util/DBAccessString");

app.use(express.json());
app.use(cors());

app.use("/uploads/images", express.static(path.join("uploads", "images")));
app.use("/api/v1/", placesRoutes);
app.use("/api/v1/", usersRoutes);

mongoConnect(() => {
  PlacesDAO.injectDB();
});

mongoose
  .connect(accessString)
  .then((result) => {
    app.listen(9000);
  })
  .catch((err) => {
    console.log(err);
  });

mongoConnect(() => {
  PlacesDAO.injectDB();
});
