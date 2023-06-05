const NotFound = (req, res) => {
  res.status(404).send("Route is not found");
};

export default NotFound;
