const db = require("../db/connection");

exports.fetchReviewByID = (review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id=$1`, [review_id])
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
