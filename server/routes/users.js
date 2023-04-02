const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json([
    {
      username: "jay",
      age: 21,
    },
    {
      username: "dev",
      age: 56,
    },
  ]);
});

module.exports = router;
