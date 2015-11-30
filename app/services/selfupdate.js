import Ember from 'ember';
import ENV from '../config/environment';
import SelfUpdateService from 'ember-cli-self-update/services/selfupdate';

const appConfig = Ember.get(ENV, 'APP');
const version = Ember.get(appConfig, 'version');

export default SelfUpdateService.extend({
  version: Ember.computed(()=> version).readOnly(),
  allowed: Ember.computed(()=> {
    // Here we test also the existence of the key.
    // If the key is not available, we allow self update
    // for backward compatibility
    return !appConfig.hasOwnProperty('allowSelfUpdate') || Ember.get(appConfig, 'allowSelfUpdate');
  }).volatile().readOnly(),
  watchUpdates() {
    if (this.get('allowed')) {
      return this._super(...arguments);
    }
  }
});
