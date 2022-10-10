const db = require("../db/connection");
const format = require("pg-format");

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
  let paramsArray = [review_id];
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, paramsArray)
    .then(({ rows: [review_idCHECK] }) => {
      if (review_idCHECK) {
        let baseQuery = "UPDATE REVIEWS SET";
        const arrayOfTreasureKeys = [
          "treasure_name",
          "colour",
          "age",
          "cost_at_auction",
          "shop_id",
        ];
        let count = 2;
        for (const [key, value] of Object.entries(body)) {
          if (arrayOfTreasureKeys.includes(key)) {
            paramsArray.push(value);
            baseQuery += ` ${key} = $${count},`;
            count++;
          }
        }

        if (paramsArray.length < 2) {
          return Promise.reject({
            status: 400,
            msg: "give us something to update",
          });
        }

        baseQuery = baseQuery.slice(0, -1);

        baseQuery += ` WHERE review_id = $1 RETURNING *;`;
        console.log(baseQuery);

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
      }
    });
};
