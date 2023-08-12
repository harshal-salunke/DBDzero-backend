const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Dummy database to store user data and key-value pairs
const users = {};
const dataStore = {};

// Middleware to parse JSON body
app.use(bodyParser.json());

// Helper function to check if a key exists in the data store
const keyExists = (key) => {
  return dataStore.hasOwnProperty(key);
};

// Helper function to validate the user's password
const validatePassword = (password) => {
  // Implement your password validation logic here
  // For simplicity, we'll just check if the password has at least 8 characters
  return password.length >= 8;
};

// Helper function to validate the age
const validateAge = (age) => {
  // Check if the age is a positive integer
  return Number.isInteger(age) && age > 0;
};

// Helper function to validate the gender
const validateGender = (gender) => {
  // Check if the gender is provided and is one of the allowed values
  const allowedGenders = ["male", "female", "non-binary"];
  return allowedGenders.includes(gender.toLowerCase());
};

// User Registration API
app.post("/api/register", (req, res) => {
  const data = req.body;
  const requiredFields = ["username", "email", "password", "full_name"];

  // Check if all required fields are provided
  if (!requiredFields.every((field) => data.hasOwnProperty(field))) {
    return res.status(400).json({
      status: "error",
      code: "INVALID_REQUEST",
      message:
        "Invalid request. Please provide all required fields: username, email, password, full_name.",
    });
  }

  // Check if the username is already taken
  if (users[data.username]) {
    return res.status(409).json({
      status: "error",
      code: "USERNAME_EXISTS",
      message:
        "The provided username is already taken. Please choose a different username.",
    });
  }

  // Check if the email is already registered
  if (Object.values(users).some((user) => user.email === data.email)) {
    return res.status(409).json({
      status: "error",
      code: "EMAIL_EXISTS",
      message:
        "The provided email is already registered. Please use a different email address.",
    });
  }

  // Validate the password
  if (!validatePassword(data.password)) {
    return res.status(400).json({
      status: "error",
      code: "INVALID_PASSWORD",
      message:
        "The provided password does not meet the requirements. Password must be at least 8 characters long.",
    });
  }

  // Validate the age
  if (data.age && !validateAge(data.age)) {
    return res.status(400).json({
      status: "error",
      code: "INVALID_AGE",
      message: "Invalid age value. Age must be a positive integer.",
    });
  }

  // Validate the gender
  if (!data.gender || !validateGender(data.gender)) {
    return res.status(400).json({
      status: "error",
      code: "GENDER_REQUIRED",
      message:
        "Gender field is required. Please specify the gender (e.g., male, female, non-binary).",
    });
  }

  // Generate a unique user ID (for simplicity, using a random number here)
  const userId = Math.floor(Math.random() * 10000).toString();

  // Store user data in the database
  users[userId] = {
    user_id: userId,
    username: data.username,
    email: data.email,
    full_name: data.full_name,
    age: data.age,
    gender: data.gender.toLowerCase(),
  };

  // Return success response
  res.status(201).json({
    status: "success",
    message: "User successfully registered!",
    data: users[userId],
  });
});

// Generate Token API
app.post("/api/token", (req, res) => {
  const data = req.body;

  // Check if both username and password are provided
  if (!data.username || !data.password) {
    return res.status(400).json({
      status: "error",
      code: "MISSING_FIELDS",
      message: "Missing fields. Please provide both username and password.",
    });
  }

  // Check if the provided username exists in the database and the password is correct
  const user = Object.values(users).find(
    (user) => user.username === data.username
  );
  if (!user || user.password !== data.password) {
    return res.status(401).json({
      status: "error",
      code: "INVALID_CREDENTIALS",
      message:
        "Invalid credentials. The provided username or password is incorrect.",
    });
  }

  // Generate a dummy access token (you can use a proper authentication mechanism)
  const accessToken = "<TOKEN>";
  const expiresIn = 3600;

  res.json({
    status: "success",
    message: "Access token generated successfully.",
    data: {
      access_token: accessToken,
      expires_in: expiresIn,
    },
  });
});

// Store Data API
app.post("/api/data", (req, res) => {
  const data = req.body;
  const { key, value } = data;

  // Check if the key and value are provided
  if (!key || !value) {
    return res.status(400).json({
      status: "error",
      code: "INVALID_KEY",
      message: "The provided key or value is missing.",
    });
  }

  // Check if the key already exists
  if (keyExists(key)) {
    return res.status(409).json({
      status: "error",
      code: "KEY_EXISTS",
      message:
        "The provided key already exists in the database. To update an existing key, use the update API.",
    });
  }

  // Store the key-value pair in the data store
  dataStore[key] = value;

  res.status(201).json({
    status: "success",
    message: "Data stored successfully.",
  });
});

// Retrieve Data API
app.get("/api/data/:key", (req, res) => {
  const key = req.params.key;

  // Check if the key exists in the data store
  if (!keyExists(key)) {
    return res.status(404).json({
      status: "error",
      code: "KEY_NOT_FOUND",
      message: "The provided key does not exist in the database.",
    });
  }

  // Retrieve the value associated with the key
  const value = dataStore[key];

  res.json({
    status: "success",
    data: {
      key: key,
      value: value,
    },
  });
});

// Update Data API
app.put("/api/data/:key", (req, res) => {
  const key = req.params.key;
  const { value } = req.body;

  // Check if the key exists in the data store
  if (!keyExists(key)) {
    return res.status(404).json({
      status: "error",
      code: "KEY_NOT_FOUND",
      message: "The provided key does not exist in the database.",
    });
  }

  // Update the value associated with the key
  dataStore[key] = value;

  res.json({
    status: "success",
    message: "Data updated successfully.",
  });
});

// Delete Data API
app.delete("/api/data/:key", (req, res) => {
  const key = req.params.key;

  // Check if the key exists in the data store
  if (!keyExists(key)) {
    return res.status(404).json({
      status: "error",
      code: "KEY_NOT_FOUND",
      message: "The provided key does not exist in the database.",
    });
  }

  // Delete the key-value pair from the data store
  delete dataStore[key];

  res.json({
    status: "success",
    message: "Data deleted successfully.",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
