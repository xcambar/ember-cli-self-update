import Ember from 'ember';

export default Ember.Controller.extend({
  selfupdate: Ember.inject.service(),
  version: Ember.computed.alias('selfupdate.version'),
  hasUpdate: Ember.computed.alias('selfupdate.hasUpdate'),
  init: function () {
    this.get('selfupdate').watchUpdates();
  }
});
