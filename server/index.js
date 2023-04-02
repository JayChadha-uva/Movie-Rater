const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const app = express();
const users = require("./routes/users");

const mysql = require("mysql2/promise");

let booksNew = [];

app.get("/users", async (req, res) => {
  try {
    const connection = await mysql.createConnection({
      host: "mysql01.cs.virginia.edu",
      user: "jrc7qt",
      password: "LS##%u&Ss6QS3&Wg^4Zn",
      database: "jrc7qt",
    });

    const [rows, fields] = await connection.query("SELECT * FROM customer");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving users from database");
  }
});

//use cors to allow cross origin resource sharing
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let books = [];

app.get("/home", function (req, res) {
  console.log("Inside Home Login");
  res.writeHead(200, {
    "Content-Type": "application/json",
  });
  console.log("Books : ", JSON.stringify(books));
  res.end(JSON.stringify(books));
});

app.post("/create", async (req, res) => {
  const newMovie = {
    movieID: req.body.movieID,
    rating: req.body.rating,
    reviewTitle: req.body.reviewTitle,
    reviewText: req.body.reviewText,
  };

  books.push(newMovie);
  console.log(books);

  try {
    const connection = await mysql.createConnection({
      host: "mysql01.cs.virginia.edu",
      user: "jrc7qt",
      password: "LS##%u&Ss6QS3&Wg^4Zn",
      database: "jrc7qt",
    });

    const [rows, fields] = await connection.query(
      `INSERT INTO Movie (movieID, rating, reviewTitle, reviewText) VALUES(${req.body.movieID}, ${req.body.rating}, '${req.body.reviewTitle}', '${req.body.reviewText}');`
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving users from database");
  }
});

// Define routes
app.get("/api/movie/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const connection = await mysql.createConnection({
      host: "mysql01.cs.virginia.edu",
      user: "jrc7qt",
      password: "LS##%u&Ss6QS3&Wg^4Zn",
      database: "jrc7qt",
    });

    const [rows, fields] = await connection.query(
      `SELECT * FROM Movie WHERE movieID = ${id}`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving users from database");
  }
});

app.use("/api/users", users);

app.get("/api", (req, res) => {
  res.send("hello word form express");
});

app.listen(1234);
