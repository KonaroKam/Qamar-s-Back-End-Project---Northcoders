const db = require("../db/connection");

exports.fetchReviewByID = (review_id) => {
  return db
    .query(`SELECT reviews.*, COUNT(comments.comment_id) ::INT AS comment_count
    FROM reviews 
    LEFT JOIN comments ON comments.review_id=reviews.review_id
    WHERE reviews.review_id=$1
    GROUP BY reviews.review_id`, [review_id])
    .then(({ rows: [review] }) => {
      if (review) {
        return review;
      } else {
        return Promise.reject({
          status: 404,
          msg: "Resource cannot be found. Check ID you are trying to access before trying again.",
        });
      }
    });
};
