# MYFLIXAPP
*MYFLIX* is a RESTful API built with Node.js, Express, MongoDB, and Passport for handling user authentication and managing movies, users, and their favorites. The API allows for user registration, login, and CRUD operations on movies and user profiles.

## Features
- Fully functional movie listing app
- Dynamically loads a list of movies from an external API
- Allows viewing of detailed information about each movie (title, release year, genre, etc.)
- Responsive design that works on various screen sizes
- Search feature to find movies by title
- Sort movies by release date or rating
- Custom loading message while fetching data

## API Endpoints
**GET /movies**: Fetches all movies in the database.
**GET /movies/:title**: Fetches a movie by its title.
**GET /movies/release-year/:year**: Fetches all movies by their release year.
**GET /actors/:name**:Fetches movies featuring a specific actor.
**GET /genres/:name**: Fetches movies belonging to a specific genre.
**GET /directors/:name**: Fetches movies directed by a specific director.
**POST /users**: Registers a new user with a username, email, password, and optional birthday.
**PUT /users/:username**: Updates the user profile by username, with optional fields like newUsername, newEmail, newPassword, and newBirthday.
**PUT /users/:username/favourites/:movieID**: Adds a movie to the user's favorites list by movie ID.
**POST /login**: Logs in a user by email and password, returns a JWT token.
**DELETE /users/:username**: Deletes a user by username.
**DELETE /users/:username/favourites/:movieID**: Deletes a movie from the user's favorites list by movie ID.

## Usage:
- Navigate the movie list
- Click on a movie to view its details
- Use the search bar to find specific movies
- Sort the list by release date or rating

## Setup
*local*
1. Clone the repository: `git clone https://github.com/Milakrei55/movie_api`
2. Navigate to Project folder: `cd <project-folder>`
3. Install dependencies: `npm install`
4. Start application locally: `npm start`
5. Access in browser `http://localhost:3000`


## Technologies Used
- **Node.js**: Server-side runtime environment
- **Express**: Framework to handle routing, log requests and serve static files
- **Morgan**: HTTP request logger middleware
- **MongoDB** - NoSQL database to store movie and user data.
- **Mongoose** - ODM (Object Data Modeling) library for MongoDB.
- **Bcrypt.js** - Library for hashing passwords.
- **JWT (JSON Web Tokens)** - For authenticating users.
- **CORS** - To enable cross-origin requests from allowed origins.
- **GitHub** - Version control and repository hosting.
- **Heroku** - Hosting and deployment platform, also used to manage secure server authentication.


## Contributing

Feel free to fork this repository, create a branch, and submit a pull request. Please ensure you follow the code formatting guidelines and include tests for any new features.

## License

MIT License. See LICENSE for more information.

## Acknowledgment

 **MongoDB Atlas** for the cloud database service
- **Heroku** for hosting the app
- **GitHub** for version control and repository management
- **CareerFoundry** for guidance and support during development

## 📚 Documentation

- Inline documentation with JSDoc
- API endpoints documented within this README
- Follows RESTful principles with CRUD operations for movies and users

---

## 🌐 Hosting

The API is hosted on **Heroku** and connected to a cloud database via **MongoDB Atlas**.

---

## 🏁 Getting Started

To run this API locally:

1. Clone the repo  
   `git clone https://github.com/Milakrei55/movie_api`
2. Navigate to the project folder  
   `cd movie_api`
3. Install dependencies  
   `npm install`
4. Start the server  
   `npm start`

Access the server at `http://localhost:3000`.

---

## ✍️ Author

Developed by Michaela (Milakrei55) as part of the Full-Stack Immersion Achievement 2.

---

## 🛑 Hard Rules

- Project is for educational and portfolio use only
