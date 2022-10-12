const db = require("../db/connection");

exports.fetchReviews = (category) => {
  const paramsArray = [];
  let baseQuery = `SELECT reviews.*, COUNT(comments.comment_id) ::INT AS comment_count
  FROM reviews 
  LEFT JOIN comments ON comments.review_id=reviews.review_id`;

  if (category) {
    baseQuery += ` WHERE category=$1`;
    paramsArray.push(category);
  }

  baseQuery += ` GROUP BY reviews.review_id ORDER BY created_at DESC;`;

  return db.query(baseQuery, paramsArray).then(({ rows }) => {
    return rows;
  });
};

exports.fetchCommentsOfID = (review_id) => {
  let baseQuery = `SELECT *
  FROM comments 
  WHERE review_id=$1
  ORDER BY created_at DESC;`;

  return db.query(baseQuery, [review_id]).then(( {rows} ) => {
    return rows;
  });
}

exports.fetchReviewByID = (review_id) => {
  return db
    .query(
      `SELECT reviews.*, COUNT(comments.comment_id) ::INT AS comment_count
    FROM reviews 
    LEFT JOIN comments ON comments.review_id=reviews.review_id
    WHERE reviews.review_id=$1
    GROUP BY reviews.review_id`,
      [review_id]
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

exports.updateReviewByID = (review_id, incrementValue) => {
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

