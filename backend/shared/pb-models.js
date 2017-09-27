const protobuf = require('../node_modules/protobufjs');
const jsonModels = require('./models.json');

const setupSchemes = function() {
  const root = protobuf.Root.fromJSON(jsonModels);
  const models = {};

  Object.keys(jsonModels.nested).forEach(modelName => {
    models[modelName] = root.lookupType(modelName);
  });

  return models;
};

module.exports = setupSchemes();