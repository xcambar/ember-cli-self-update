/*jshint node:true*/
module.exports = {
  description: 'ember-cli-self-update: Installs jQuery-Mockjax for testing',
  //Hack for previous versions of Ember CLI
  normalizeEntityName: function() {},

  afterInstall: function(/* options */) {
    return this.addBowerPackageToProject('jquery-mockjax', '^2.0.1');
  }
};
