const pb = require('../../../shared/pb');

module.exports = modelName => {
  const field = modelName.charAt(0).toLowerCase() + modelName.slice(1);
  return (req, res, next) => {
    req[field] = pb.parse(req.body).to(modelName);
    next();
  };
};