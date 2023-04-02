const express = require("express");
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
// Define routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/users", users);

app.get("/api", (req, res) => {
  res.send("hello word form express");
});

app.listen(1234);
