import models from './pb-models'

const toArrayBuffer = function(src) {
  const size = src.length;
  const arrayBuffer = new ArrayBuffer(src.length);
  (new Uint8Array(arrayBuffer, 0, size)).set(new Uint8Array(src, 0, size));

  return arrayBuffer;
};

const parse = function(data) {
  return {
    to: function(modelName) {
      const model = models[modelName];
      const obj = model.decode(data);
      return model.toObject(obj, {
        defaults: true,
        arrays: true,
        objects: true
      });
    }
  };
};

const make = function(modelName, cast) {
  return {
    from: function(data) {
      const model = models[modelName];;
      const obj = model.create(data);
      const buf = model.encode(obj).finish();
      if (cast) {
        return toArrayBuffer(buf);
      }
      return buf;
    }
  };
};

export default {
  parse,
  make
};