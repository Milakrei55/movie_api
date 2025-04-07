const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const uuid = require("uuid");
const _ = require("lodash");
const mongoose = require("mongoose");
const Models = require("./models.js");

//mongoose.connect('mongodb://localhost:27017/mfDB', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect( process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });


const { check, validationResult } = require('express-validator');
const { User } = require('./models.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors());

let auth = require('./auth')(app);
const { generateJWTToken } = require('./auth');
const passport = require('passport');
require('./passport.js');

const Movies = Models.Movie;
const Users = Models.User;

// WELCOME users to the app
app.get('/', (req, res) => {
  res.send('Welcome to Michaela\'s MyFlix app!');
});

let allowedOrigins = ['http://localhost:8080', 'https://milasmovieflix-ab66d5118b4d.herokuapp.com/'];

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));

// CREATE - Register a new user
app.post('/users',
  [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], async (req, res) => {

  // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
      .then((user) => {
        if (user) {
          //If the user is found, send a response that it already exists
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
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  });

// UPDATE - Allow users to update their user info 
app.put('/users/:Username',[
  check("Username", "Username is required").isLength({ min: 5 }),
  check("Username", "Username contains non alphanumeric characters - not allowed.").isAlphanumeric(),
  check("Password", "Password is required").not().isEmpty()
], async (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
  let hashedPassword = Users.hashPassword(req.body.Password);


  await Users.findOneAndUpdate({ username: req.params.Username }, {
      $set:
      {
        Username: req.body.Username,
        Password: Users.hashPassword(req.body.Password),
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
  },
      { new: true }) 
      .then((updatedUser) => {
          res.json(updatedUser);
      })
      .catch((err) => {
          console.log(err);
          res.status(500).send('Error: ' + err);
      });
});

// ADD favorite movie to a user
app.post('/users/:Username/movies/:MovieID', async (req, res) => {
  await Users.findOneAndUpdate(
    { Username: req.params.Username },
    { $addToSet: { FavoriteMovies: req.params.MovieID } }, 
    { new: true }
  )
  .then((updatedUser) => {
    res.status(200).json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// DELETE - Allow users to remove a movie from their list of favorites 
app.delete('/users/:Username/movies/:MovieID', async (req, res) => {
  await Users.findOneAndUpdate(
    { Username: req.params.Username },
    { $pull: { FavoriteMovies: req.params.MovieID } },
    { new: true }
  )
  .then((updatedUser) => {
    res.status(200).json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// DELETE - Allow existing users to deregister/ delete user
app.delete('/users/:Username', async (req, res) => {
  await Users.findOneAndDelete({Username: req.params.Username})
  .then((user) => {
      if (!user) {
          res.status(400).send(req.params.Username + ' was not found');
      } else {
          res.status(200).send(req.params.Username + ' was deleted.');
      }
  })
  .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
  });
});

// GET all movies
app.get('/movies', async (req, res) => {
  await Movies.find()
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error:' + err);
    });
});

// GET all users 
app.get('/users', async (req, res) => {
  await Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// GET user by username
app.get('/users/:Username', async (req, res) => {
	await Users.findOne({ Username: req.params.Username })
		.then((user) => {
			res.json(user);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

// GET movie by title
app.get('/movies/:title', async (req, res) => {
  await Movies.findOne({ Title: req.params.title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// GET genre by name
app.get('/movies/genre/:genreName', async (req, res) => {
  await Movies.findOne({ "Genre.Name": req.params.genreName })
    .then((movie) => {
      if (movie) {
        res.json(movie.Genre);
      } else {
        res.status(404).send("Genre not found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// GET director by name
app.get('/movies/directors/:directorName', async (req, res) => {
  await Movies.findOne({ "Director.Name": req.params.directorName })
    .then((movie) => {
      if (movie) {
        res.json(movie.Director);
      } else {
        res.status(404).send("Director not found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Listen
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});
