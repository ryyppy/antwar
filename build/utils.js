'use strict';
var path = require('path');

var async = require('async');
var cpr = require('cpr');
var cp = require('cp');


exports.copyExtraAssets = function(buildDir, assets, cb) {
  assets = assets || [];

  async.forEach(assets, function(asset, cb) {
    var from = asset.from;

    if(from.indexOf('./') === 0) {
        cp(from, path.join(buildDir, asset.to, from), cb);
    }
    else {
        cpr(from, path.join(buildDir, asset.to), cb);
    }
  }, cb);
};
