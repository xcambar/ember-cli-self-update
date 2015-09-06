/* jshint node: true */
'use strict';

var writeFile = require('broccoli-file-creator');
var mergeTrees = require('broccoli-merge-trees');
var appVersion = require('ember-cli-app-version');

module.exports = {
  name: 'ember-cli-self-update',
  config: function (env/* , config */) {
    var versionInfo = { APP: {} };
    appVersion.config.call(this, env, versionInfo);
    return versionInfo;
  },
  treeForPublic: function (tree) {
    var version = this.config().APP.version;
    var versionFile = writeFile('/version.json', version);
    return mergeTrees([tree, versionFile].filter(Boolean));
  }
};
