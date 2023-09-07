const mongodb = require("mongodb");
const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const ObjectId = mongodb.ObjectId;

const getUserById = async (req, res, next) => {
  const userId = req.params.userId;
  console.log(userId);
  let user;
  user = await User.findById(ObjectId(userId));
  console.log(user);

  res.json({ user });
};

const addNewUser = async (req, res, next) => {
  const { username, email, password } = req.body;

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again.",
      500
    );
    return next(error);
  }

  const createdUser = new User({
    name: username,
    email: email,
    password: hashedPassword,
    profileImage: req.file.path,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    console.log(error);
  }
  res.status(201).json({ userId: createdUser.id, email: createdUser.email });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later. @User.findOne",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
    if (isValidPassword) {
      console.log("Password checked and is correct");
    }
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      "supersecret_dont_share",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });
};

const updateProfile = async (req, res, next) => {
  const { username, email, password, image } = req.body;

  const userId = req.params.userId;

  let userProfile;
  try {
    userProfile = await User.findById(ObjectId(userId));
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update user.",
      500
    );
    return next(error);
  }

  if (password) {
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
      const error = new HttpError(
        "Could not create user, please try again.",
        500
      );
      return next(error);
    }
    userProfile.password = hashedPassword;
  }

  if (username) {
    userProfile.name = username;
  }
  if (email) {
    userProfile.email = email;
  }

  if (req.file) {
    userProfile.profileImage = req.file.path;
  }

  try {
    await userProfile.save();
    res.status(200).json({ userProfile });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update user 2nd.",
      500
    );
    return next(error);
  }
};

const deleteUser = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    await User.deleteOne({ _id: ObjectId(userId) });
  } catch (err) {
    console.log(err);
  }
};

exports.addNewUser = addNewUser;
exports.login = login;
exports.getUserById = getUserById;
exports.updateProfile = updateProfile;
exports.deleteUser = deleteUser;
