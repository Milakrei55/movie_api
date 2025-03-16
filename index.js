const express = require("express"),
const app = express(), 
bodyParser = require("body-parser"), 
const uuid = require("uuid");

app.use(bodyParser.json());

const mongoose = require("mongoose");
const Models = require("./models.js");
const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/mfDB', { useNewUrlParser: true, useUnifiedTopology: true });


//CREATE - Allow new users to register, add a user //
app.post('/users', async (req, res) => {
  await Users.findOne({ Username: req.body.Username })
  .then((user) => {
      if (user) {
          return res.status(400).send(reqbody.Username + 'already exists');
      } else {
          Users
          .create ({
              Username: req.body.Username,
              Password: req.boddy.Password,
              Email: req.body.Email,
              Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).removeAllListeners(user) })
          .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
          })
      }
  })
  .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
  });
});


// UPDATE - Allow users to update their user info (username
/*
Required Elements:
Username: String
Password: String
Email: String

Not Required:
Birthday: Date
*/

app.put('/users/:id', async (req, res) => {
  await Users.findOneAndUpdate({Username: req.params.Username }, {$set: 
      {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
      }
  }, 
  {new: true }) // This line makes sure that the updated document is returned
  .then((updatedUser) => {
      res.json(updatedUser);
  })
  .catch((err) => {
      console.error(err);
      res.status(500).send('Error:' + err);
  });
});

//POST(CREATE) - Allow users to add a movie to their list of favorites //
app.post("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
  } else {
    res.status(400).send("no such user");
  }
});

app.post('/users/:id/movieTitle', async (req, res) => {
  await Users.findOneAndUpdate({Username: req.params.id}, {
      $push: {favoriteMovies: req.params.movieTitle}
  },
  {new: true})
  .then((updatedUser) => {
      res.json(updatedUser);
  })
  .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
  });
});

//DELETE - Allow users to remove a movie from their list of favorites //
app.delete('/users/:id/movieTitle', async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.id }, {
      $pull: { FavoriteMovies: req.params.MovieTitle }
  },
  { new: true })
  .then((updatedUser) => {
      res.json(updatedUser);
  })
  .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
  });
})

//DELETE - Allow existing users to deregister //
app.delete('/users/:id', async (req, res) => {
  await Users.findOneAndRemove({Username: req.params.id})
  .then((user) => {
      if (!user) {
          res.status(400).send(req.params.id + 'was not found');
      } else {
          res.status(200).send(req.params.id + 'was deleted.');
      }
  })
  .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
  });
});

//READ - Return data about all movies //
app.get('/movies', async (req, res) => {
  await Movies.find()
  .then((movies) => {
      res.status(201).json(movies);
  })
  .catch((err) => {
      console.error(err);
      res.status(500).send('Error:' + err);
  });
});

//READ - Return data about single movie by title //
app.get('/movies/:title', async (req, res) => {
  await Movies.findOne({Title: req.params.Title })
  .then((movie) => {
      res.json(movie);
  })
  .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
  });
});

//READ - Return data about a genre by name //
app.get('/movies/genre/:genreName', async (req, res) => {
  await Movies.findOne({ "Genre.Name": req.params.genre })
  .then((movie) => {
      res.json(director);
  })
  .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
  })
});

//READ - Return data about a director by name //
app.get('/movies/directors/:directorName', async (req, res) => {
  await Movies.findOne({directorName: req.params.directorName })
  .then((movie) => {
      res.json(directorName);
  })
  .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
  });
});

// Port listen
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});