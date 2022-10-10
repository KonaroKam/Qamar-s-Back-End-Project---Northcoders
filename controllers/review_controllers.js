const { fetchReviewByID } = require("../models/reviews_models");

exports.getReviewByID = (req, res, next) => {
  //stuff
  const {review_id} = req.params
  console.log(review_id), "review_id"
  fetchReviewByID(review_id)
    .then((review) => {
      console.log(review);
      res.status(200).send({review});
    })
    .catch((err) => {
      next(err);
    });
};
