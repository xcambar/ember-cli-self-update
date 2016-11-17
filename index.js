/* jshint node: true */
'use strict';

var writeFile   = require('broccoli-file-creator');
var mergeTrees  = require('broccoli-merge-trees');
var appVersion  = require('ember-cli-app-version');

var endpoint, version;

function appendVersionFile(tree) {
  /*jshint validthis:true */
  var versionFile = writeFile(endpoint, JSON.stringify(version));
  return mergeTrees([tree, versionFile].filter(Boolean));
}

module.exports = {
  name: 'ember-cli-self-update',
  config: function (env, config) {
    this.project.addons
      .filter((add)=> add.name === 'ember-cli-app-version')
      .map((add)=> add.config(env, config));
    endpoint = endpoint || config.APP.versionEndpoint || '/version.json';
    version = version || config.APP.version
  },
  treeForPublic: appendVersionFile,
  treeForTestSupport: appendVersionFile,
  included: function (app) { }
};
