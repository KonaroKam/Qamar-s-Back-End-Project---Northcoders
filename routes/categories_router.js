const categoriesRouter = require("express").Router();

apiRouter.get('/', (req,res,next) => {
    res.status(200).send({endpoint_guide})
  })


  module.exports = apiRouter