const express = require("express");
let dotenv = require("dotenv").config();
const app = express();
const auth = require("./auth");
const mysql = require("mysql2/promise");
const cors = require("cors");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.options("/login", cors());

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
      req.body.email,
    ];

    const [rows, fields] = await connection.execute(query, params);

    res.status(200).send("Review created successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating review");
  }
});

// favorite a genre for a user
app.post("/api/genre/favorite", async (req, res) => {
  try {
    const connection = await mysql.createConnection({
      host: dotenv.parsed.DB_HOST,
      user: dotenv.parsed.DB_USER,
      password: dotenv.parsed.DB_PASS,
      database: dotenv.parsed.DB_DB,
    });

    const query = "INSERT INTO prefers (email, genre_id) VALUES (?, ?)";
    const params = [req.body.email, req.body.genre_id];

    const [rows, fields] = await connection.execute(query, params);

    res.status(200).send("Genre favorited");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating review");
  }
});

//Delete a genre by a user
app.delete("/api/genre/favorite/delete", async (req, res) => {
  try {
    const connection = await mysql.createConnection({
      host: dotenv.parsed.DB_HOST,
      user: dotenv.parsed.DB_USER,
      password: dotenv.parsed.DB_PASS,
      database: dotenv.parsed.DB_DB,
    });

    const params = [req.body.email, req.body.genre_id];
    console.log(params);
    const [rows, fields] = await connection.execute(
      "DELETE FROM prefers WHERE email = ? AND genre_id = ?",
      params
    );
    res.status(200).send("Review Deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving users from database");
  }
});

// get favorite genres
app.get("/api/genre/favorite/:email", async (req, res) => {
  const email = req.params.email;
  try {
    const connection = await mysql.createConnection({
      host: dotenv.parsed.DB_HOST,
      user: dotenv.parsed.DB_USER,
      password: dotenv.parsed.DB_PASS,
      database: dotenv.parsed.DB_DB,
    });

    const [rows, fields] = await connection.query(
      "SELECT * FROM Genre NATURAL JOIN prefers WHERE email = ?",
      [email]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving users from database");
  }
});

// add movie to DB
app.post("/insert/movie", async (req, res) => {
  try {
    const connection = await mysql.createConnection({
      host: dotenv.parsed.DB_HOST,
      user: dotenv.parsed.DB_USER,
      password: dotenv.parsed.DB_PASS,
      database: dotenv.parsed.DB_DB,
    });

    const query =
      "INSERT INTO Movie (movie_id, title, image_url) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE movie_id=?";
    const params = [
      req.body.movieID,
      req.body.title,
      req.body.imgURL,
      req.body.movieID,
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

app.get("/api/movie/:id/:email", async (req, res) => {
  const id = req.params.id;
  const email = req.params.email;
  try {
    const connection = await mysql.createConnection({
      host: dotenv.parsed.DB_HOST,
      user: dotenv.parsed.DB_USER,
      password: dotenv.parsed.DB_PASS,
      database: dotenv.parsed.DB_DB,
    });

    const params = [email, id];

    const [rows, fields] = await connection.query(
      "SELECT * FROM (SELECT * FROM rates WHERE email = ?) AS user_rating RIGHT JOIN (SELECT * FROM Review WHERE movie_id = ?) AS R ON R.review_id = user_rating.review_id ORDER BY R.review_date DESC",
      params
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving users from database");
  }
});

app.get("/api/movie/:id/:email/:field/:order", async (req, res) => {
  const id = req.params.id;
  const email = req.params.email;
  const field = req.params.field;
  const order = req.params.order;
  try {
    const connection = await mysql.createConnection({
      host: dotenv.parsed.DB_HOST,
      user: dotenv.parsed.DB_USER,
      password: dotenv.parsed.DB_PASS,
      database: dotenv.parsed.DB_DB,
    });

    const params = [email, id, field, order];

    const [rows, fields] = await connection.query(
      "SELECT * FROM (SELECT * FROM rates WHERE email = ?) AS user_rating RIGHT JOIN (SELECT * FROM Review WHERE movie_id = ?) AS R ON R.review_id = user_rating.review_id ORDER BY R." +
        field +
        " " +
        order,
      params
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving users from database");
  }
});

// Average review
app.get("/api/averageReview/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const connection = await mysql.createConnection({
      host: dotenv.parsed.DB_HOST,
      user: dotenv.parsed.DB_USER,
      password: dotenv.parsed.DB_PASS,
      database: dotenv.parsed.DB_DB,
    });

    const [rows, fields] = await connection.query(
      "SELECT AVG(rating) as avgRating FROM Review WHERE movie_id = ?",
      [id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving users from database");
  }
});

// Get genres
app.get("/api/genres", async (req, res) => {
  const id = req.params.id;
  try {
    const connection = await mysql.createConnection({
      host: dotenv.parsed.DB_HOST,
      user: dotenv.parsed.DB_USER,
      password: dotenv.parsed.DB_PASS,
      database: dotenv.parsed.DB_DB,
    });

    const [rows, fields] = await connection.query("SELECT * FROM Genre", [id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving users from database");
  }
});

// Define routes
app.get("/api/genres/movies", async (req, res) => {
  const id = req.params.id;
  try {
    const connection = await mysql.createConnection({
      host: dotenv.parsed.DB_HOST,
      user: dotenv.parsed.DB_USER,
      password: dotenv.parsed.DB_PASS,
      database: dotenv.parsed.DB_DB,
    });

    const [rows, fields] = await connection.query(
      "SELECT * FROM Movie NATURAL JOIN has WHERE genre_id=:genre_to_filter",
      [id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving users from database");
  }
});

// all reviews for a user
app.get("/api/:email", async (req, res) => {
  const email = req.params.email;
  try {
    const connection = await mysql.createConnection({
      host: dotenv.parsed.DB_HOST,
      user: dotenv.parsed.DB_USER,
      password: dotenv.parsed.DB_PASS,
      database: dotenv.parsed.DB_DB,
    });
    const [rows, fields] = await connection.query(
      "SELECT * FROM Review WHERE email = ? ORDER BY review_date DESC",
      [email]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving users from database");
  }
});

//Delete a review by a user
app.delete("/api/review/delete", async (req, res) => {
  try {
    const connection = await mysql.createConnection({
      host: dotenv.parsed.DB_HOST,
      user: dotenv.parsed.DB_USER,
      password: dotenv.parsed.DB_PASS,
      database: dotenv.parsed.DB_DB,
    });

    const params = [req.body.email, req.body.review_title, req.body.movie_id];
    console.log(params);
    const [rows, fields] = await connection.execute(
      "DELETE FROM Review WHERE email = ? AND review_title = ? AND movie_id = ?",
      params
    );
    res.status(200).send("Review Deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving users from database");
  }
});

app.post("/api/review/rate", async (req, res) => {
  try {
    const connection = await mysql.createConnection({
      host: dotenv.parsed.DB_HOST,
      user: dotenv.parsed.DB_USER,
      password: dotenv.parsed.DB_PASS,
      database: dotenv.parsed.DB_DB,
    });

    const query =
      "INSERT INTO rates (email, review_id, is_like) VALUES(?, ?, ?) ON DUPLICATE KEY UPDATE is_like = ?";
    const params = [
      req.body.rateReview.email,
      req.body.rateReview.review_id,
      req.body.rateReview.is_like,
      req.body.rateReview.is_like,
    ];
    // console.log(params);
    const [rows, fields] = await connection.execute(query, params);

    res.status(200).send("Review Rated successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving users from database");
  }
});

app.delete("/api/review/rate/delete", async (req, res) => {
  try {
    const connection = await mysql.createConnection({
      host: dotenv.parsed.DB_HOST,
      user: dotenv.parsed.DB_USER,
      password: dotenv.parsed.DB_PASS,
      database: dotenv.parsed.DB_DB,
    });

    const query = "DELETE FROM rates WHERE email = ? AND review_id = ?";
    const params = [req.body.email, req.body.review_id];

    const [rows, fields] = await connection.execute(query, params);

    res.status(200).send("Review Rated successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving users from database");
  }
});

// login part
app.post("/register", async (req, res) => {
  try {
    const connection = await mysql.createConnection({
      host: dotenv.parsed.DB_HOST,
      user: dotenv.parsed.DB_USER,
      password: dotenv.parsed.DB_PASS,
      database: dotenv.parsed.DB_DB,
    });

    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    const query =
      "INSERT INTO Users (email, first_name, last_name, password) VALUES(?, ?, ?, ?)";
    const params = [email, firstName, lastName, password];
    const [rows, fields] = await connection.execute(query, params);
    res.send("Register complete");
  } catch (err) {
    res.send({ message: "Error during registration" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const connection = await mysql.createConnection({
      host: dotenv.parsed.DB_HOST,
      user: dotenv.parsed.DB_USER,
      password: dotenv.parsed.DB_PASS,
      database: dotenv.parsed.DB_DB,
    });

    const email = req.body.email;
    const password = req.body.password;

    const query = "SELECT * FROM Users WHERE email=? and password =? ";
    const params = [email, password];
    const [rows, fields] = await connection.execute(query, params);

    if (rows.length > 0) {
      console.log("Setting cookie:", rows[0].email);
      res.send({ message: "Login successful" });
    } else {
      res.send({ message: "Wrong User name or password" });
    }
  } catch (err) {
    res.send({ message: "Error logging in" });
  }
});

app.listen(1234);
