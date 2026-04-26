exports.getMessage = (req, res) => {
  res.json({
    message: 'Hello World from Backend!',
    timestamp: new Date().toISOString()
  });
};
