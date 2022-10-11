const {
  fetchReviews,
  fetchReviewByID,
  updateReviewByID,
} = require("../models/reviews_models");


exports.getReviewByID = (req, res, next) => {
  const { review_id } = req.params;
  fetchReviewByID(review_id)
  .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => { -m 
      next(err);
    });
  };
  
  exports.patchReviewByID = (req, res, next) => {
    const { review_id } = req.params;
    const { inc_votes } = req.body;
  updateReviewByID(review_id, inc_votes)
    .then((updatedReview) => {
      res.status(200).send({ updatedReview });
    })
    .catch((err) => {
      next(err);
    });
  };
  
  exports.getReviews = (req, res, next) => {
    QUERY = req.query
    fetchReviews(QUERY)
      .then((reviews) => {
        res.status(200).send({ reviews });
      })
      .catch((err) => {
        next(err);
      });
  };