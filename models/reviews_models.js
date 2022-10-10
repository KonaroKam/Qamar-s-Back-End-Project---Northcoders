const db = require("../db/connection");
const format = require("pg-format");

exports.fetchReviewByID = (review_id) => {
  //models stuff
  return db
    .query(`SELECT * FROM reviews WHERE review_id=$1`, [review_id])
    .then(({ rows: [review] }) => {
      console.log(rows, "<<<<rows");
      console.log(review, "<<<<review");

      return review;
    });
};
