﻿# DBDzero-backend

# User Management and Data Storage API

This project consists of a simple Express.js API for user registration, authentication, and data storage. Users can register, log in to receive access tokens, and store/retrieve/update/delete key-value pairs in the data store.

## Table of Contents

Frameworks
Database Schema
Getting Started
Installation
Usage
API Endpoints
Contributing
Frameworks
The project is built using the following technologies:

Express.js: A fast and minimal web application framework for Node.js that provides robust features for building APIs.

## Database Schema

The API uses two data structures:

users: A JavaScript object to store user data including user ID, username, email, full name, age, and gender.
dataStore: A JavaScript object to store key-value pairs.

## Getting Started

### Installation

Clone the repository:
bash
Copy code
git clone [https://github.com/yourusername/your-repo.git](https://github.com/harshal-salunke/DBDzero-backend)
cd your-repo
Install the dependencies:
bash
Copy code
npm install

### Usage

Start the server:
bash
Copy code
npm start
The server will be running on port 3000. You can access the API using the base URL: http://localhost:3000.

## API Endpoints

User Registration
Endpoint: POST /api/register

Description: Register a new user.

Request Body:

json
Copy code
{
"username": "exampleuser",
"email": "user@example.com",
"password": "password123",
"full_name": "John Doe",
"age": 25,
"gender": "male"
}
Response: User data with a unique user ID.

### Generate Token

Endpoint: POST /api/token

Description: Generate an access token for a registered user.

Request Body:

json
Copy code
{
"username": "exampleuser",
"password": "password123"
}
Response: Access token with expiration time.

### Store Data

Endpoint: POST /api/data

Description: Store a key-value pair in the data store.

Request Body:

json
Copy code
{
"key": "example_key",
"value": "example_value"
}
Response: Success message.

### Retrieve Data

Endpoint: GET /api/data/:key
Description: Retrieve the value associated with a key.
Response: Key-value pair.

### Update Data

Endpoint: PUT /api/data/:key

Description: Update the value associated with a key.

Request Body:

json
Copy code
{
"value": "new_value"
}
Response: Success message.

### Delete Data

Endpoint: DELETE /api/data/:key
Description: Delete a key-value pair.
Response: Success message.

### Contributing

Contributions are welcome! If you find any issues or have suggestions, feel free to submit a pull request or open an issue on the GitHub repository.
