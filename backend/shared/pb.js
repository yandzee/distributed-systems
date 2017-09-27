const models = require('./pb-models');

const toArrayBuffer = src => {
  const size = src.length;
  const arrayBuffer = new ArrayBuffer(src.length);
  (new Uint8Array(arrayBuffer, 0, size)).set(new Uint8Array(src, 0, size));

  return arrayBuffer;
};

const parse = data => {
  return {
    to(modelName) {
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

const make = (modelName, cast) => {
  return {
    from(data) {
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

module.exports = {
  parse,
  make
};