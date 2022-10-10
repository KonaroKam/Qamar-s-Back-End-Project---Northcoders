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

exports.updateReviewByID = (review_id, updates) => {

  // Jim suggests reevaluating and using PSQL errors instead and expanding that error block to respond specific errors
  // AND TO Destructure inc_votes in the controller rather than all this updates.inc_votes here
  if (
    !updates.inc_votes ||
    typeof updates.inc_votes !== "number" ||
    Object.keys(updates).length > 1
  ) {
    return Promise.reject({
      status: 400,
      msg: "Bad request body. Reconsider requirements.",
    });
  }
  const incrementValue = updates.inc_votes;

  return db
    .query(
      `UPDATE reviews SET votes = votes + $2 WHERE review_id=$1 RETURNING *`,
      [review_id, incrementValue]
    )
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
