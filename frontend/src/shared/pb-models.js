import protobuf from 'protobufjs'
import jsonModels from './models.json'

const setupSchemes = function() {
  const root = protobuf.Root.fromJSON(jsonModels);
  const models = {};

  Object.keys(jsonModels.nested).forEach(function(modelName) {
    models[modelName] = root.lookupType(modelName);
  });

  return models;
};

export default setupSchemes();