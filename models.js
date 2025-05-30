const bcrypt = require('bcrypt');
const mongoose = require("mongoose");

/**
 * Movie schema definition using Mongoose.
 *
 * @typedef {Object} Movie
 * @property {string} Title - The title of the movie.
 * @property {string} Description - Description of the movie.
 * @property {Object} Genre - Genre information.
 * @property {string} Genre.Name - Name of the genre.
 * @property {string} Genre.Description - Description of the genre.
 * @property {Object} Director - Director information.
 * @property {string} Director.Name - Director's name.
 * @property {string} Director.Bio - Director's biography.
 * @property {Array<string>} Actors - Array of actor names.
 * @property {string} ImagePath - Path to movie poster image.
 * @property {boolean} Featured - Whether the movie is featured.
 */
let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String,
  },
  Director: {
    Name: String,
    Bio: String,
  },
  Actors: [String],
  ImagePath: String,
  Featured: Boolean,
});

/**
 * User schema definition using Mongoose.
 *
 * @typedef {Object} User
 * @property {string} Username - Unique username.
 * @property {string} Password - User's hashed password.
 * @property {string} Email - User's email address.
 * @property {Date} Birthday - User's birth date.
 * @property {Array<ObjectId>} FavoriteMovies - Array of favorite movie IDs.
 */
let userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

/**
 * Hashes a password using bcrypt.
 *
 * @function
 * @param {string} password - Plain-text password.
 * @returns {string} Hashed password.
 */
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

/**
 * Compares input password with hashed password.
 *
 * @function
 * @param {string} password - Plain-text password to compare.
 * @returns {boolean} Returns true if passwords match.
 */
userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

let Movie = mongoose.model("Movie", movieSchema);
let User = mongoose.model("User", userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
