const express = require("express");
const logger = require("morgan");
const cors = require("cors");
let dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
const app = express();
const auth = require("./auth");
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
      "INSERT INTO Movie (movie_id, title, image_url) VALUES (?, ?, ?)";
    const params = [req.body.movieID, req.body.title, req.body.imgURL];

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

// Specify order by parameters
app.get("/api/movie/:field/:order/:id", async (req, res) => {
  const field = req.params.field;
  const order = req.params.order;
  const id = req.params.id;
  try {
    const connection = await mysql.createConnection({
      host: dotenv.parsed.DB_HOST,
      user: dotenv.parsed.DB_USER,
      password: dotenv.parsed.DB_PASS,
      database: dotenv.parsed.DB_DB,
    });

    const query =
      "SELECT * FROM Review WHERE movie_id = ? ORDER BY " + field + " " + order;
    const params = [id];

    const [rows, fields] = await connection.query(query, params);

    res.json(rows);
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

app.get("/api/movie/:email", async (req, res) => {
  const email = req.params.email;
  try {
    const connection = await mysql.createConnection({
      host: dotenv.parsed.DB_HOST,
      user: dotenv.parsed.DB_USER,
      password: dotenv.parsed.DB_PASS,
      database: dotenv.parsed.DB_DB,
    });

    const [rows, fields] = await connection.query(
      "SELECT * FROM Users WHERE email=?",
      [id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving users from database");
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
      res.send(rows);
    } else {
      res.send({ message: "Wrong User name or password" });
    }
  } catch (err) {
    res.send({ message: "Error logging in" });
  }
});

app.listen(1234);
