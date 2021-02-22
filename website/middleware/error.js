const errorHandler = (err, req, res, next) => {
  if (err.status == 404)
    res.send("The page you are looking for doesn't exist.");
  else {
    console.log(err.message);
    res.status(err.status).send(err.message);
  }
};

export { errorHandler };
