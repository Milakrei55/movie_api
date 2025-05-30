const jwtSecret = "your_jwt_secret"; // This must match the key used in the JWTStrategy

const jwt = require("jsonwebtoken"),
  passport = require("passport");

require("./passport"); // Local passport configuration

/**
 * Generates a JSON Web Token (JWT) for a user.
 *
 * @function
 * @param {Object} user - The user object to encode into the token.
 * @param {string} user.Username - The username to be included as the subject.
 * @returns {string} The signed JWT token.
 */
let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, // Encoded subject
    expiresIn: "7d", // Token expiration (7 days)
    algorithm: "HS256", // HMAC SHA-256 signing algorithm
  });
};

/**
 * @function
 * @name loginRoute
 * @description Defines the POST /login endpoint for user login and token generation.
 *
 * @param {Express.Router} router - Express router object.
 * @returns {void}
 */
module.exports = (router) => {
  /**
   * POST /login
   * @name POST/login
   * @function
   * @inner
   * @memberof module:auth
   * @description Authenticates user using passport-local strategy, generates a JWT on success.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {Object} JSON containing user data and a JWT token.
   */
  router.post("/login", (req, res) => {
    passport.authenticate("local", { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: "Something is not right",
          user: user,
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          return res.status(500).send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
};

module.exports.generateJWTToken = generateJWTToken;
