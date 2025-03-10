const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  uuid = require("uuid");

app.use(bodyParser.json());

//Define array of users
let users = [
  {
    id: 1,
    name: "Dave",
    favoriteMovies: [],
  },
  {
    id: 2,
    name: "Helga",
    favoriteMovies: ["The Shawshank Redemption"],
  },
];

//Define array of movies
let movies = [
  {
    Title: "The Shawshank Redemption",
    Description:
      "A banker convicted of uxoricide forms a friendship over a quarter century with a hardened convict, while maintaining his innocence and trying to remain hopeful through simple compassion.",
    Genre: {
      Name: "Drama",
      Description: "Drama description here.",
    },
    Director: {
      Name: "Frank Darabont",
      Bio: "Frequently makes adaptations of stories or novels by Stephen King.",
      Birth: 1959.0,
    },
    ImageURL:
      "https://m.media-amazon.com/images/I/71oUnx5WA4L._AC_UF894,1000_QL80_.jpg",
    Featured: true,
  },

  {
    Title: "The Godfather",
    Description:
      "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    Genre: {
      Name: "Drama",
      Description: "Drama description here.",
    },
    Director: {
      Name: "Francis Ford Coppola",
      Bio: "Francis Ford Coppola was born in 1939 in Detroit, Michigan, but grew up in a New York suburb in a creative, supportive Italian-American family.",
      Birth: 1939.0,
    },
    ImageURL:
      "https://m.media-amazon.com/images/I/71b6IS-+mZL._AC_UF894,1000_QL80_.jpg",
    Featured: true,
  },

  {
    Title: "The Dark Knight",
    Description:
      "When a menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman, James Gordon and Harvey Dent must work together to put an end to the madness.",
    Genre: {
      Name: "Superhero",
      Description: "Superhero description here.",
    },
    Director: {
      Name: "Christopher Nolan",
      Bio: "Best known for his cerebral, often nonlinear, storytelling, acclaimed Academy Award winner writer/director/producer Sir Christopher Nolan CBE was born in London, England.",
      Birth: 1970.0,
    },
    ImageURL:
      "https://m.media-amazon.com/images/S/pv-target-images/fba136c7b31cf00c94edf3bed55173ea1e5005ebf3b95b0d7acfc4523f2ad699.jpg",
    Featured: true,
  },

  {
    Title: "12 Angry Men",
    Description:
      "The jury in a New York City murder trial is frustrated by a single member whose skeptical caution forces them to more carefully consider the evidence before jumping to a hasty verdict.",
    Genre: {
      Name: "Drama",
      Description: "Drama description here.",
    },
    Director: {
      Name: "Sidney Lumet",
      Bio: "Sidney Lumet was a master of cinema, best known for his technical knowledge and his skill at getting first-rate performances from his actors -- and for shooting most of his films in his beloved New York.",
      Birth: 1924.0,
    },
    ImageURL:
      "https://m.media-amazon.com/images/S/pv-target-images/20378953b2a3416c9e70e12698b3afc1ec233a6dc50034dacaa0cd7dd165fdf5.jpgX",
    Featured: true,
  },

  {
    Title: "The Lord of the Rings: The Return of the King",
    Description:
      "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
    Genre: {
      Name: "Fantasy",
      Description: "Fantasy description here.",
    },
    Director: {
      Name: "Peter Jackson",
      Bio: "Sir Peter Jackson made history with The Lord of the Rings trilogy, becoming the first person to direct three major feature films simultaneously.",
      Birth: 1961.0,
    },
    ImageURL:
      "https://m.media-amazon.com/images/S/pv-target-images/be32bd86cd1e85f0bf7b27022096bb66a6075099132fcafb5c3e681dd94341a5.jpg",
    Featured: true,
  },

  {
    Title: "Schindlers List",
    Description:
      "In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.",
    Genre: {
      Name: "Drama",
      Description: "Drama description here.",
    },
    Director: {
      Name: "Steven Spielberg",
      Bio: "One of the most influential personalities in the history of cinema, Steven Spielberg is Hollywood's best known director and one of the wealthiest filmmakers in the world.",
      Birth: 1946.0,
    },
    ImageURL:
      "https://m.media-amazon.com/images/I/81+H4lZVw+L._AC_UF894,1000_QL80_.jpg",
    Featured: true,
  },

  {
    Title: "Pulp Fiction",
    Description:
      "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    Genre: {
      Name: "Comedy",
      Description: "Comedy description here.",
    },
    Director: {
      Name: "Quentin Tarantino",
      Bio: "Quentin Jerome Tarantino was born in Knoxville, Tennessee. His father, Tony Tarantino, is an Italian-American actor and musician from New York, and his mother, Connie (McHugh), is a nurse from Tennessee.",
      Birth: 1963.0,
    },
    ImageURL:
      "https://m.media-amazon.com/images/I/51Tc6L5vu3L._AC_UF1000,1000_QL80_.jpg",
    Featured: true,
  },

  {
    Title: "The Good, the Bad and the Ugly",
    Description:
      "A bounty-hunting scam joins two men in an uneasy alliance against a third in a race to find a fortune in gold buried in a remote cemetery.",
    Genre: {
      Name: "Western",
      Description: "Western description here.",
    },
    Director: {
      Name: "Sergio Leone",
      Bio: "Sergio Leone was virtually born into the cinema - he was the son of Roberto Roberti (A.K.A. Vincenzo Leone), one of Italys cinema pioneers, and actress Bice Valerian.",
      Birth: 1929.0,
    },
    ImageURL:
      "https://m.media-amazon.com/images/S/pv-target-images/a8275e14cf7e2380ad1c6536d214e372c73c53908b26b7e95a70f68e3470d070.jpg",
    Featured: true,
  },

  {
    Title: "Forrest Gump",
    Description:
      "The history of the United States from the 1950s to the '70s unfolds from the perspective of an Alabama man with an IQ of 75, who yearns to be reunited with his childhood sweetheart.",
    Genre: {
      Name: "Drama",
      Description: "Drama description here.",
    },
    Director: {
      Name: "Robert Zemeckis",
      Bio: "A whiz-kid with special effects, Robert is from the Spielberg camp of film-making (Steven Spielberg produced many of his films).",
      Birth: 1952.0,
    },
    ImageURL:
      "https://m.media-amazon.com/images/I/81xTx-LxAPL._AC_UF894,1000_QL80_.jpg",
    Featured: true,
  },

  {
    Title: "Fight Club",
    Description:
      "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.",
    Genre: {
      Name: "Drama",
      Description: "Drama description here.",
    },
    Director: {
      Name: "David Fincher",
      Bio: "David Fincher was born in 1962 in Denver, Colorado, and was raised in Marin County, California. When he was 18 years old he went to work for John Korty at Korty Films in Mill Valley.",
      Birth: 1962.0,
    },
    ImageURL:
      "https://m.media-amazon.com/images/I/61sNuDFJlWL._AC_UF894,1000_QL80_.jpg",
    Featured: true,
  },
];

//CREATE - Allow new users to register
app.post("/users", (req, res) => {
  const newUser = req.body;
  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(400).send("users need names");
  }
});

//UPDATE - Allow users to update their user info (username
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send("no such user");
  }
});

//POST(CREATE) - Allow users to add a movie to their list of favorites
app.post("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find( user => user.id == id );

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
  } else {
    res.status(400).send("no such user");
  }
});

//DELETE - Allow users to remove a movie from their list of favorites
app.delete("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find( user => user.id == id );

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
    res.status(200).send(`${movieTitle} has been removed from to user ${id}'s array`);
  } else {
    res.status(400).send("no such user");
  }
});

//DELETE - Allow existing users to deregister
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  let user = users.find( user => user.id == id );

  if (user) {
    users = users.filter( user => user.id != id);
    res.status(200).send(`user ${id} has been deleted`);
  } else {
    res.status(400).send("no such user");
  }
});

//READ - Return data about all movies
app.get("/movies", (req, res) => {
  res.status(200).json(movies);
});

//READ - Return data about single movie by title
app.get("/movies/:title", (req, res) => {
  const { title } = req.params;
  const movie = movies.find((movie) => movie.Title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send("no such movie");
  }
});

//READ - Return data about a genre by name
app.get("/movies/genre/:genreName", (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find((movie) => movie.Genre.Name === genreName).Genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send("no such genre");
  }
});

//READ - Return data about a director by name
app.get("/movies/directors/:directorName", (req, res) => {
  const { directorName } = req.params;
  const director = movies.find(
    (movie) => movie.Director.Name === directorName
  ).Director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send("no such director");
  }
});

// Port listen
app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
