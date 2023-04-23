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

// login part
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  con.query(
    "INSERT INTO Users (email, first_name, last_name, password) VALUES(?, ?, ?, ?)",
    [email, firstName, lastName, password],
    (err, result) => {
      if (result) {
        res.send(result);
      } else {
        res.send({ message: "Error, enter the required fields" });
      }
    }
  );
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  con.query(
    "SELECT * FROM Users WHERE email=? and password =? ",
    [email, password],
    (err, result) => {
      if (err) {
        res.setEncoding({ err: err });
      } else {
        if (result.length > 0) {
          res.send(result);
          const token = jwt.sign(
            {
              userEmail: email,
            },
            "RANDOM-TOKEN",
            { expiresIn: "24h" }
          );
        } else {
          res.send({ message: "Wrong User name or password" });
        }
      }
    }
  );
});

// auth

app.get("/auth-endpoint", auth, (request, response) => {
  response.json({ message: "You are authorized to access me" });
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.listen(1234);
