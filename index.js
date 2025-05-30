/**
 * @fileoverview Main entry point for the myFlix API server.
 * Sets up routes, middleware, and database connection.
 */

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const uuid = require("uuid");
const _ = require("lodash");
const mongoose = require("mongoose");
const Models = require("./models.js");
const { check, validationResult } = require("express-validator");
const cors = require("cors");
const passport = require("passport");

const Movies = Models.Movie;
const Users = Models.User;

// Database connection
mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
require("./passport");
require("./auth")(app);
const { generateJWTToken } = require("./auth");

// Allow listed domains
let allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:1234",
  "http://localhost:4200",
  "https://milasmovieflix-ab66d5118b4d.herokuapp.com",
  "https://cfmyflixmk.netlify.app",
  "https://milakrei55.github.io",
  "https://milakrei55.github.io/CFAngularMyFlix",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        let message =
          "The CORS policy for this application doesn’t allow access from origin " +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);

/**
 * Welcome endpoint
 * @route GET /
 * @returns {string} Welcome message
 */
app.get("/", (req, res) => {
  res.send("Welcome to Michaela's MyFlix app!");
});

/**
 * Register a new user
 * @route POST /users
 * @param {string} Username - must be at least 5 characters, alphanumeric
 * @param {string} Password - required
 * @param {string} Email - valid email required
 * @param {string} Birthday - optional
 * @returns {Object} New user object and JWT or error
 */
app.post('/users',
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ],
  async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    await Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + " already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: Users.hashPassword(req.body.Password),
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              let token = generateJWTToken(user.toJSON());
              res.status(201).json({ user, token });
            })
            .catch((error) => res.status(500).send("Error: " + error));
        }
      })
      .catch((error) => res.status(500).send("Error: " + error));
  });

/**
 * Update user info
 * @route PUT /users/:Username
 * @returns {Object} Updated user info or error
 */
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), [
  check("Username", "Username is required").isLength({ min: 5 }),
  check("Username", "Username contains non alphanumeric characters - not allowed.").isAlphanumeric(),
  check("Password", "Password is required").not().isEmpty()
], async (req, res) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  await Users.findOneAndUpdate({ Username: req.params.Username }, {
    $set: {
      Username: req.body.Username,
      Password: Users.hashPassword(req.body.Password),
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  }, { new: true })
    .then((updatedUser) => res.json(updatedUser))
    .catch((err) => res.status(500).send('Error: ' + err));
});

/**
 * Add a movie to user's favorites
 * @route POST /users/:Username/movies/:MovieID
 * @returns {Object} Updated user with new favorite or error
 */
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOneAndUpdate(
    { Username: req.params.Username },
    { $addToSet: { FavoriteMovies: req.params.MovieID } },
    { new: true }
  )
    .then((updatedUser) => res.status(200).json(updatedUser))
    .catch((err) => res.status(500).send('Error: ' + err));
});

/**
 * Remove a movie from user's favorites
 * @route DELETE /users/:Username/movies/:MovieID
 * @returns {Object} Updated user without the movie or error
 */
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOneAndUpdate(
    { Username: req.params.Username },
    { $pull: { FavoriteMovies: req.params.MovieID } },
    { new: true }
  )
    .then((updatedUser) => res.status(200).json(updatedUser))
    .catch((err) => res.status(500).send('Error: ' + err));
});

/**
 * Delete a user
 * @route DELETE /users/:Username
 * @returns {string} Deletion confirmation or error
 */
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOneAndDelete({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => res.status(500).send('Error: ' + err));
});

/**
 * Get all movies
 * @route GET /movies
 * @returns {Array} List of all movies
 */
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.find()
    .then((movies) => res.status(200).json(movies))
    .catch((err) => res.status(500).send('Error:' + err));
});

/**
 * Get all users
 * @route GET /users
 * @returns {Array} List of all users
 */
app.get('/users', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.find()
    .then((users) => res.status(201).json(users))
    .catch((err) => res.status(500).send('Error: ' + err));
});

/**
 * Get user by username
 * @route GET /users/:Username
 * @returns {Object} User data
 */
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOne({ Username: req.params.Username })
    .then((user) => res.json(user))
    .catch((err) => res.status(500).send('Error: ' + err));
});

/**
 * Get movie by title
 * @route GET /movies/:title
 * @returns {Object} Movie data
 */
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ Title: req.params.title })
    .then((movie) => res.json(movie))
    .catch((err) => res.status(500).send('Error: ' + err));
});

/**
 * Get genre by name
 * @route GET /movies/genre/:genreName
 * @returns {Object} Genre data or error
 */
app.get('/movies/genre/:genreName', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ "Genre.Name": req.params.genreName })
    .then((movie) => {
      if (movie) {
        res.json(movie.Genre);
      } else {
        res.status(404).send("Genre not found");
      }
    })
    .catch((err) => res.status(500).send('Error: ' + err));
});

/**
 * Get director by name
 * @route GET /movies/directors/:directorName
 * @returns {Object} Director data or error
 */
app.get('/movies/directors/:directorName', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ "Director.Name": req.params.directorName })
    .then((movie) => {
      if (movie) {
        res.json(movie.Director);
      } else {
        res.status(404).send("Director not found");
      }
    })
    .catch((err) => res.status(500).send('Error: ' + err));
});

/**
 * Error handler middleware
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});
