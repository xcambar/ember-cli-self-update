/* jshint node: true */
'use strict';

var writeFile   = require('broccoli-file-creator');
var mergeTrees  = require('broccoli-merge-trees');
var appVersion  = require('ember-cli-app-version');

function appendVersionFile(tree) {
  /*jshint validthis:true */
  var version = this.config().APP.version;
  var versionFile = writeFile('/version.json', JSON.stringify(version));
  return mergeTrees([tree, versionFile].filter(Boolean));
}

module.exports = {
  name: 'ember-cli-self-update',
  config: function (env/* , config */) {
    var versionInfo = { APP: {} };
    appVersion.config.call(this, env, versionInfo);
    return versionInfo;
  },
  treeForPublic: appendVersionFile,
  treeForTestSupport: appendVersionFile,
  included: function (app) {
    if (app.env === 'test') {
      app.import(app.bowerDirectory + '/jquery-mockjax/dist/jquery.mockjax.js');
    }
  }
};
