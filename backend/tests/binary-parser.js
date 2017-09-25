// Author: Renat Tuktarov (yandzeek@gmail.com)

const binaryParser = function(res, fn){
  const data = [];
  res.on('data', chunk => data.push(chunk));
  res.on('end', _ =>  fn(null, Buffer.concat(data)));
  return data;
};

module.exports = binaryParser;