// Copyright 2017 Sourcerer, Inc. All Rights Reserved.
// Author: Renat Tuktarov (renat@sourcerer.io)
const protobuf = require('protobufjs');

const binaryParser = function(res, fn){
  const data = [];
  res.on('data', chunk => data.push(chunk));
  res.on('end', _ =>  fn(null, Buffer.concat(data)));
  return data;
};

class Protobufed {
  constructor() {
    const basePath = `${__dirname}/../schemes/protobuf`
    this.faceSchemesPath = `${basePath}/face-scheme.proto`;
    this.statsSchemesPath = `${basePath}/scheme.proto`;

    this.schemes = {
      face: {},
      stats: {}
    };

    this.utils = {
      binaryParser
    };
  }

  async prepare() {
    this.schemes.face = await this.setupFaceSchemes();
    this.schemes.stats = await this.setupStatsSchemes();
  }

  async setupFaceSchemes() {
    const schemes = await protobuf.load(this.faceSchemesPath);

    const Result = schemes.lookupType('Result');
    const RegistrationData = schemes.lookupType('RegistrationData');

    return { Result, RegistrationData };
  }

  async setupStatsSchemes() {
    const schemes = await protobuf.load(this.statsSchemesPath);

    const Commit = schemes.lookupType('app.Commit');
    const CommitStats = schemes.lookupType('app.CommitStats');
    const CommitGroup = schemes.lookupType('app.CommitGroup');
    const Fact = schemes.lookupType('app.Fact');
    const FactGroup = schemes.lookupType('app.FactGroup');
    const User = schemes.lookupType('app.User');
    const Repo = schemes.lookupType('app.Repo');

    return {
      Commit, CommitStats, CommitGroup, Fact, FactGroup, User, Repo
    };
  }

  // Builders definitions.
  registrationData(regData) {
    const { RegistrationData } = this.schemes.face;
    const regDataMessage = RegistrationData.create(regData);
    return RegistrationData.encode(regDataMessage).finish();
  }

  parseResult(resultPb) {
    const { Result } = this.schemes.face;
    return Result.decode(resultPb);
  }
}

module.exports = new Protobufed;
