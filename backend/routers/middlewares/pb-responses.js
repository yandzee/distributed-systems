// Author: Renat Tuktarov (yandzeek@gmail.com)

const pbModels = require ('../../shared/pb-models');

const buildMethod = (res, model) => {
  return data => {
    const obj = model.create(data);
    const buf = model.encode(obj).finish();

    res.send(buf);
    return res;
  };
};

module.exports = (req, res, next) => {
  const schemeNames = Object.keys(pbModels);
  schemeNames.forEach(name => {
    const methodName = name.charAt(0).toLowerCase() + name.slice(1);
    res[methodName] = buildMethod(res, pbModels[name]);
  });
  next();
};