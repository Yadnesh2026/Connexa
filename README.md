# Connexa

A Node.js and Express.js backend for Connexa, a professional networking platform inspired by LinkedIn.

## Features

* User Registration
* User Login Authentication
* Password Hashing using bcrypt
* Token-based Authentication
* User Profile Management
* Profile Picture Upload using Multer
* Update User Information
* Update Profile Information
* Get User and Profile Details
* Get All User Profiles
* MongoDB Database Integration
* RESTful API Architecture

## Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* bcrypt
* Multer
* dotenv
* CORS

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd backend
```

### Install Dependencies

```bash
npm install
```

### Create Environment Variables

Create a `.env` file:

```env
MONGO_URL=your_mongodb_connection_string
```

### Run Development Server

```bash
npm run dev
```

Server runs on:

```txt
http://localhost:9090
```

## API Endpoints

| Method | Endpoint              |
| ------ | --------------------- |
| POST   | /register             |
| POST   | /login                |
| POST   | /upload_profile       |
| POST   | /user_update          |
| POST   | /updateProfileData    |
| POST   | /get_user_and_profile |
| POST   | /getAllUserProfile    |

## Project Structure

```txt
backend/
│
├── controllers/
├── models/
├── routes/
├── uploads/
├── .env
├── server.js
├── package.json
└── README.md
```

## Future Improvements

* JWT Authentication
* Posts and Feed System
* Comments and Likes
* Connection Requests
* Real-time Messaging
* Cloud Image Storage
* Role-Based Authorization



Built as a learning project to explore full-stack web development using Node.js, Express.js, MongoDB, and modern backend architecture.
