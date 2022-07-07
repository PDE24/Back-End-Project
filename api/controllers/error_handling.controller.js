exports.handleInvalidPaths = (req, res) => {
  res.status(404).send({ msg: "Invalid Request" });
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handlePSQLErrors = (err, req, res, next) => {
   if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid ID must be a number" });
  } else if (err.code === "23503") {
      res.status(404).send({ msg: "Resource does not exist" });
  } else {
    next(err);
  }
};

exports.handle500Errors = (err, req, res, next) => {
  res.status(500).send({ msg: "Server Error" });
};
