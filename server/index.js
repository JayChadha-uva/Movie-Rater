const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const app = express();
const users = require("./routes/users");

const mysql = require("mysql2/promise");

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
  try {
    const connection = await mysql.createConnection({
      host: "mysql01.cs.virginia.edu",
      user: "jrc7qt",
      password: "LS##%u&Ss6QS3&Wg^4Zn",
      database: "jrc7qt",
    });

    const query =
      "INSERT INTO Movie (movieID, rating, reviewTitle, reviewText, date) VALUES (?, ?, ?, ?, ?)";
    const params = [
      req.body.movieID,
      req.body.rating,
      req.body.reviewTitle,
      req.body.reviewText,
      req.body.date,
    ];

    const [rows, fields] = await connection.execute(query, params);

    res.status(200).send("Review created successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating review");
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
      `SELECT * FROM Movie WHERE movieID = ${id} ORDER BY date DESC`
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
