exports.badPathErrorHandler = (req, res, next) => {
  res.status(404).send({
    msg: "Resource cannot be found. Check path you are trying to access before trying again.",
  });
};

exports.jsErrorHandler = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.psqlErrorHandler = (err, req, res, next) => {
  if (err.code && err.code === "22P02") {
    res
      .status(400)
      .send({ msg: "Bad data type. Reconsider path requirements." });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "Bad request body. Reconsider requirements." });
  } else if (err.code.length === 5) {
    console.log("PSQL ERROR: >>> ", err);
    res.status(400).send({ msg: "Bad PSQL ERROR. See console." });
  } else {
    next(err);
  }
};

exports.defaultErrorHandler = (err, req, res, next) => {
  console.log("Default ERROR block triggered. See error: >>> ", err);
  res
    .status(500)
    .send({ msg: "INTERNAL SERVER ERROR. Examine code and resolve error." });
};
