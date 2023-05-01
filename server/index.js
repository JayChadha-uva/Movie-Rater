const express = require("express");
let dotenv = require("dotenv").config();
const app = express();
const auth = require("./auth");
const mysql = require("mysql2/promise");
const cors = require("cors");

const pool = mysql.createPool({
  host: dotenv.parsed.DB_HOST,
  user: dotenv.parsed.DB_USER,
  database: dotenv.parsed.DB_DB,
  password: dotenv.parsed.DB_PASS,
  waitForConnections: true,
  connectionLimit: 1,
  maxIdle: 1, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
});

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

    const [rows, fields] = await pool.execute(query, params);

    res.status(200).send("Review created successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating review");
  }
});

// favorite a genre for a user
app.post("/api/genre/favorite", async (req, res) => {
  try {
    const query = "INSERT INTO prefers (email, genre_id) VALUES (?, ?)";
    const params = [req.body.email, req.body.genre_id];

    const [rows, fields] = await pool.execute(query, params);

    res.status(200).send("Genre favorited");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating review");
  }
});

app.get("/api/genre/user/prefers/:id", async (req, res) => {
  const genre_id = req.params.id;
  try {
    const [rows, fields] = await pool.query(
      "SELECT * FROM Movie NATURAL JOIN has WHERE ? IN (SELECT ? FROM prefers)",
      [genre_id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving users from database");
  }
});

//Delete a genre by a user
app.delete("/api/genre/favorite/delete", async (req, res) => {
  try {
    const params = [req.body.email, req.body.genre_id];
    // console.log(params);
    const [rows, fields] = await pool.execute(
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
    const [rows, fields] = await pool.query(
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
    const query =
      "INSERT INTO Movie (movie_id, title, image_url) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE movie_id=?";
    const params = [
      req.body.movieID,
      req.body.title,
      req.body.imgURL,
      req.body.movieID,
    ];

    const [rows, fields] = await pool.execute(query, params);

    res.status(200).send("Review created successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating review");
  }
});

app.post("/insert/movie/genre", async (req, res) => {
  try {
    const query =
      "INSERT INTO has (movie_id, genre_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE movie_id=?";
    const params = [req.body.movieID, req.body.genreID, req.body.movieID];

    const [rows, fields] = await pool.execute(query, params);

    res.status(200).send("Review created successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating review");
  }
});

// Define routes
app.get("/api/movie/:id/:email/:field/:order", async (req, res) => {
  const id = req.params.id;
  const email = req.params.email;
  const field = req.params.field;
  const order = req.params.order;
  try {
    const params = [email, id, field, order];

    const [rows, fields] = await pool.query(
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
    const [rows, fields] = await pool.query(
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
    const [rows, fields] = await pool.query("SELECT * FROM Genre", [id]);
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
    const [rows, fields] = await pool.query(
      "SELECT * FROM Movie NATURAL JOIN has WHERE genre_id=:genre_to_filter",
      [id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving users from database");
  }
});

app.get("/api/track/:email", async (req, res) => {
  const email = req.params.email;
  try {
    const [rows, fields] = await pool.query(
      "SELECT * FROM Movie NATURAL JOIN tracks WHERE email = ?",
      [email]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving users from database");
  }
});

app.get("/api/track/:email/:movie_id", async (req, res) => {
  const email = req.params.email;
  const movie_id = req.params.movie_id;
  try {
    const [rows, fields] = await pool.query(
      "SELECT * FROM Movie NATURAL JOIN tracks WHERE email = ? AND movie_id = ?",
      [email, movie_id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving users from database");
  }
});

app.post("/api/track/update", async (req, res) => {
  try {
    const query =
      "INSERT INTO tracks (email, movie_id, track_date, status) VALUES (?, ?, NOW(), ?) ON DUPLICATE KEY UPDATE status=?";
    const params = [
      req.body.trackMovie.email,
      req.body.trackMovie.movie_id,
      req.body.trackMovie.new_status,
      req.body.trackMovie.new_status,
    ];

    const [rows, fields] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving users from database");
  }
});

app.delete("/api/track/delete", async (req, res) => {
  try {
    const query = "DELETE FROM tracks WHERE email=? AND movie_id=?";
    const params = [req.body.email, req.body.movie_id];

    const [rows, fields] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving users from database");
  }
});

// Follows a user
app.post("/api/user/follow", async (req, res) => {
  try {
    const query = "INSERT INTO follows (email, f_email) VALUES (?, ?)";
    const params = [req.body.followUser.email, req.body.followUser.f_email];

    const [rows, fields] = await pool.execute(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving users from database");
  }
});

// Unfollows a user
app.delete("/api/user/unfollow", async (req, res) => {
  try {
    const query = "DELETE FROM follows WHERE email=? AND f_email=?";
    const params = [req.body.email, req.body.f_email];

    const [rows, fields] = await pool.execute(query, params);
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
    const [rows, fields] = await pool.query(
      "SELECT * FROM Review R NATURAL JOIN (SELECT email, first_name, last_name FROM Users WHERE email = ?) U ORDER BY R.review_date DESC",
      [email]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving users from database");
  }
});

// five recent reviews from user's followed
app.get("/api/:email/follow", async (req, res) => {
  const email = req.params.email;
  try {
    const [rows, fields] = await pool.query(
      "SELECT * FROM Review R NATURAL JOIN (SELECT email FROM follows WHERE f_email = ?) U ORDER BY R.review_date DESC LIMIT 5",
      [email]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving users from database");
  }
});

// Get name from email
app.post("/api/user/get", async (req, res) => {
  try {
    const email = req.body.email;

    const query = "SELECT first_name, last_name FROM Users WHERE email=?";
    const params = [email];
    const [rows, fields] = await pool.execute(query, params);
    res.send(rows);
  } catch (err) {
    res.send({ message: "Error during registration" });
  }
});

// Get if user is following a user
app.post("/api/user/get/follow", async (req, res) => {
  try {
    const email = req.body.email;
    const f_email = req.body.f_email;

    const query = "SELECT * FROM follows WHERE email=? AND f_email=?";
    const params = [email, f_email];
    const [rows, fields] = await pool.execute(query, params);
    res.send(rows);
  } catch (err) {
    res.send({ message: "Error during registration" });
  }
});

//Delete a review by a user
app.delete("/api/review/delete", async (req, res) => {
  try {
    const params = [req.body.email, req.body.review_title, req.body.movie_id];
    // console.log(params);
    const [rows, fields] = await pool.execute(
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
    const query =
      "INSERT INTO rates (email, review_id, is_like) VALUES(?, ?, ?) ON DUPLICATE KEY UPDATE is_like = ?";
    const params = [
      req.body.rateReview.email,
      req.body.rateReview.review_id,
      req.body.rateReview.is_like,
      req.body.rateReview.is_like,
    ];
    // console.log(params);
    const [rows, fields] = await pool.execute(query, params);

    res.status(200).send("Review Rated successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving users from database");
  }
});

app.delete("/api/review/rate/delete", async (req, res) => {
  try {
    const query = "DELETE FROM rates WHERE email = ? AND review_id = ?";
    const params = [req.body.email, req.body.review_id];

    const [rows, fields] = await pool.execute(query, params);

    res.status(200).send("Review Rated successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving users from database");
  }
});

// login part
app.post("/register", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    const query =
      "INSERT INTO Users (email, first_name, last_name, password) VALUES(?, ?, ?, ?)";
    const params = [email, firstName, lastName, password];
    const [rows, fields] = await pool.execute(query, params);
    res.send("Register complete");
  } catch (err) {
    res.send({ message: "Error during registration" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const query = "SELECT * FROM Users WHERE email=? and password =? ";
    const params = [email, password];
    const [rows, fields] = await pool.execute(query, params);

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
