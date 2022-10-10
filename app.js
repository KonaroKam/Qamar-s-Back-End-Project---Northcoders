const express = require("express");
const app = express();

const { getCategories } = require("./controllers/categories_controllers");
const { getReviewByID } = require("./controllers/review_controllers");

//pre-emptively added this for when the body of the request becomes important
app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewByID);

app.all("/api/*", (req, res, next) => {
  res.status(404).send({
    msg: "Resource cannot be found. Check path you are trying to access before trying again.",
  });
});

//JS ERROR HANDLING
app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

//PSQL ERROR HANDLING
app.use((err, req, res, next) => {
  if (err.code && (err.code === "22P02" || err.code.length === 5)) {
    console.log("PSQL ERROR: >>> ", err);
    res.status(400).send({ msg: "Bad request. Reconsider path." });
  } else {
    next(err);
  }
});

//DEFAULT ERROR HANDLING
app.use((err, req, res, next) => {
  console.log("Default ERROR block triggered. See error: >>> ", err);
  res
    .status(500)
    .send({ msg: "INTERNAL SERVER ERROR. Examine code and resolve error." });
});

module.exports = app;
