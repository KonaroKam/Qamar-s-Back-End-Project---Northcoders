const {
  fetchReviews,
  fetchReviewByID,
  updateReviewByID,
  fetchCommentsOfID,
  addCommentsAtID
} = require("../models/reviews_models");
const {fetchCategoriesBySlug} = require('../models/categories_models')

exports.getReviews = (req, res, next) => {
  const {category, sort_by, order} = req.query
    
  const promises = [fetchReviews(category, sort_by, order)]

  if (category) {
    promises.push(fetchCategoriesBySlug(category))
  }

  Promise.all(promises)
    .then((promisesReturn) => {
      res.status(200).send({ reviews: promisesReturn[0] });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsOfID = (req,res,next) =>{
  const { review_id } = req.params;

  const promises = [fetchCommentsOfID(review_id), fetchReviewByID(review_id)]

  Promise.all(promises)
    .then((promisesReturn) => {
      res.status(200).send({ comments: promisesReturn[0] });
    })
    .catch((err) => {
      next(err);
    });
}

exports.getReviewByID = (req, res, next) => {
  const { review_id } = req.params;
  fetchReviewByID(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
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

exports.postCommentsAtID = (req,res,next) => {
  const { review_id } = req.params;
  
  const body = req.body;

  addCommentsAtID(review_id, body).then((newComment) => {
    res.status(201).send( newComment);
  })
  .catch((err) => {
    next(err);
  });
}