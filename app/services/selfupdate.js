import Ember from 'ember';
import ENV from '../config/environment';
import SelfUpdateService from 'ember-cli-self-update/services/selfupdate';

const version = Ember.get(ENV, 'APP.version');

export default SelfUpdateService.extend({
  version: Ember.computed(()=> version).readOnly(),
});
