const e = require("express");
const express = require("express");
const app = express();
app.use(express.json());

const {
  badPathErrorHandler,
  jsErrorHandler,
  psqlErrorHandler,
  defaultErrorHandler,
} = require("./controllers/error_controller");

const { getCategories } = require("./controllers/categories_controllers");

const {
  getReviews,
  getReviewByID,
  patchReviewByID,
  getCommentsOfID,
  postCommentsAtID
} = require("./controllers/review_controllers");

const { getUsers } = require("./controllers/users_controllers");

const {endpoint_instructions} = require('./endpoints.json')

app.get("/api", (req,res,next) => {
  res.status(200).send({endpoint_instructions})
});

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewByID);
app.patch("/api/reviews/:review_id", patchReviewByID);

app.get("/api/reviews/:review_id/comments", getCommentsOfID);
app.post("/api/reviews/:review_id/comments", postCommentsAtID);

app.get("/api/users", getUsers);

app.all("/api/*", badPathErrorHandler);

app.use(jsErrorHandler);
app.use(psqlErrorHandler);
app.use(defaultErrorHandler);

module.exports = app;
