const express = require("express"), // Import Express for logging requests
  morgan = require("morgan"),  // Import Morgan for logging requests
  fs = require("fs"), // Import built in node modules fs and path
  bodyParser = require("body-parser"), //Parse incoming request bodies in a middleware
  path = require("path"); // Built-in modules path to help file paths work

const app = express();
// create a write stream (in append mode)
// a ‘log.txt’ file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});

//Define array of top movies
let topMovies = [
  {
      title: 'The Shawshank Redemption',
      description: `A banker convicted of uxoricide forms a friendship over a quarter century with a hardened convict, while maintaining his innocence and trying to remain hopeful through simple compassion.`,
      genre: ['Drama'],
      imgURL: '',
      featured: true,
      director: {
          name:'Frank Darabont',
          bio: `Frequently makes adaptations of stories or novels by Stephen King.`,
          birthYear: 1959,
          deathYear: null
      }
  },
  {
      title: 'The Godfather',
      description: `The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.`,
      genre: ['Drama', 'Crime'],
      imgURL: '',
      featured: true,
      director: {
          name:'Francis Ford Coppola',
          bio: `Francis Ford Coppola was born in 1939 in Detroit, Michigan, but grew up in a New York suburb in a creative, supportive Italian-American family.`,
          birthYear: 1939,
          deathYear: null
      }
  },
  {
      title: 'The Dark Knight',
      description: `When a menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman, James Gordon and Harvey Dent must work together to put an end to the madness.`,
      genre: ['Superhero', 'Drama', 'Thriller'],
      imgURL: '',
      featured: true,
      director: {
          name:'Christopher Nolan',
          bio: `Best known for his cerebral, often nonlinear, storytelling, acclaimed Academy Award winner writer/director/producer Sir Christopher Nolan CBE was born in London, England.`,
          birthYear: 1970,
          deathYear: null
      }
  },
  {
      title: '12 Angry Men',
      description: `The jury in a New York City murder trial is frustrated by a single member whose skeptical caution forces them to more carefully consider the evidence before jumping to a hasty verdict.`,
      genre: ['Drama', 'Crime'],
      imgURL: '',
      featured: true,
      director: {
          name:'Sidney Lumet',
          bio: `Sidney Lumet was a master of cinema, best known for his technical knowledge and his skill at getting first-rate performances from his actors -- and for shooting most of his films in his beloved New York.`,
          birthYear: 1924,
          deathYear: 2011
      }
  },
  {
      title: 'The Lord of the Rings: The Return of the King',
      description: `Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.`,
      genre: ['Fantasy', 'Adventure', 'Drama', 'Action'],
      imgURL: '',
      featured: true,
      director: {
          name:'Peter Jackson',
          bio: `Sir Peter Jackson made history with The Lord of the Rings trilogy, becoming the first person to direct three major feature films simultaneously.`,
          birthYear: 1961,
          deathYear: null
      }
  },
  {
      title: 'Schindlers List',
      description: `In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.`,
      genre: ['Drama', 'Biography'],
      imgURL: '',
      featured: true,
      director: {
          name:'Steven Spielberg',
          bio: `One of the most influential personalities in the history of cinema, Steven Spielberg is Hollywood's best known director and one of the wealthiest filmmakers in the world.`,
          birthYear: 1946,
          deathYear: null
      }
  },
  {
      title: 'Pulp Fiction',
      description: `The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.`,
      genre: ['Comedy', 'Drama'],
      imgURL: '',
      featured: true,
      director: {
          name:'Quentin Tarantino',
          bio: `Quentin Jerome Tarantino was born in Knoxville, Tennessee. His father, Tony Tarantino, is an Italian-American actor and musician from New York, and his mother, Connie (McHugh), is a nurse from Tennessee.`,
          birthYear: 1963,
          deathYear: null
      }
  },
  {
      title: 'The Good, the Bad and the Ugly',
      description: `A bounty-hunting scam joins two men in an uneasy alliance against a third in a race to find a fortune in gold buried in a remote cemetery.`,
      genre: ['Western', 'Comedy', 'Drama'],
      imgURL: '',
      featured: false,
      director: {
          name:'Sergio Leone',
          bio: 'Sergio Leone was virtually born into the cinema - he was the son of Roberto Roberti (A.K.A. Vincenzo Leone), one of Italys cinema pioneers, and actress Bice Valerian.',
          birthYear: 1929,
          deathYear: 1989
      }
  },   
  {
      title: 'Forrest Gump',
      description: `The history of the United States from the 1950s to the '70s unfolds from the perspective of an Alabama man with an IQ of 75, who yearns to be reunited with his childhood sweetheart.`,
      genre: ['Drama', 'Romance'],
      imgURL: '',
      featured: true,
      director: {
          name:'Robert Zemeckis',
          bio: 'A whiz-kid with special effects, Robert is from the Spielberg camp of film-making (Steven Spielberg produced many of his films).',
          birthYear: 1952,
          deathYear:null
      }
  },
  {
      title: 'Fight Club',
      description: `An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.`,
      genre: ['Drama'],
      imgURL: '',
      featured: true,
      director: {
          name:'David Fincher',
          bio: 'David Fincher was born in 1962 in Denver, Colorado, and was raised in Marin County, California. When he was 18 years old he went to work for John Korty at Korty Films in Mill Valley.',
          birthYear: 1962,
          deathYear:null
      }
  },      
];

// GET requests
app.get("/", (req, res) => {
  res.send("Welcome to my Movie App!");
});

app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

app.get("/movies", (req, res) => {
  res.json(topMovies); // Sends the whole movie array as JSON
});

// setup the logger
app.use(morgan("combined", { stream: accessLogStream }));

app.get("/", (req, res) => {
  res.send("Welcome to my app!");
});

app.get("/secreturl", (req, res) => {
  res.send("This is a secret url with super top-secret content.");
});

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());
app.use(methodOverride());

app.use((err, req, res, next) => {});

//Error Handling
app.use((err, req, res, next) => {
  res.status(500).send("Something broke!");
});

// Port listen
app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
