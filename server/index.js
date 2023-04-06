const express = require("express");
const logger = require("morgan");
const cors = require("cors");
let dotenv = require("dotenv").config();
const app = express();

const mysql = require("mysql2/promise");

//use cors to allow cross origin resource sharing
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/create", async (req, res) => {
  try {
    const connection = await mysql.createConnection({
      host: dotenv.parsed.DB_HOST,
      user: dotenv.parsed.DB_USER,
      password: dotenv.parsed.DB_PASS,
      database: dotenv.parsed.DB_DB,
    });

    const query =
      "INSERT INTO Review (movie_id, rating, review_title, review_text, review_date, email) VALUES (?, ?, ?, ?, ?, ?)";
    const params = [
      req.body.movieID,
      req.body.rating,
      req.body.reviewTitle,
      req.body.reviewText,
      req.body.date,
      "ebarrett21@gmail.com", // TODO: change to be the user signed in
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
      host: dotenv.parsed.DB_HOST,
      user: dotenv.parsed.DB_USER,
      password: dotenv.parsed.DB_PASS,
      database: dotenv.parsed.DB_DB,
    });

    const [rows, fields] = await connection.query(
      "SELECT * FROM Review WHERE movie_id = ? ORDER BY review_date DESC",
      [id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving users from database");
  }
});

app.listen(1234);
