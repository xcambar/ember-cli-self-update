import Ember from 'ember';
import ENV from '../config/environment';
import SelfUpdateService from 'ember-cli-self-update/services/selfupdate';

const appConfig = Ember.get(ENV, 'APP');
const version = Ember.get(appConfig, 'version');
// Here we test also the existence of the key.
// If the key is not available, we allow self update
// for backward compatibility
const allowSelfUpdate = !appConfig.hasOwnProperty('allowSelfUpdate') || Ember.get(appConfig, 'allowSelfUpdate');

export default SelfUpdateService.extend({
  version: Ember.computed(()=> version).readOnly(),
  watchUpdates() {
    if (allowSelfUpdate) {
      return this._super(...arguments);
    }
  }
});
