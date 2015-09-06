import Ember from 'ember';
import ajax from 'ic-ajax';

let hasUpdate = false;

export default Ember.Service.extend({
  hasUpdate: Ember.computed(()=> hasUpdate).readOnly().volatile(),
  delay: 5 * /* 60 * */ 1000, //ms <=> 5min

  applyUpdate() {
    window.location.reload(true);
  },

  watchUpdates() {
    if (this.get('_timer')) {
      return;
    }
    this.set('_timer', Ember.run.later(this, '_periodicWatch'), 0); // Run asap, yet set a timer
  },
  _periodicWatch() {
    var uri = [this.get('endpoint'), '_r=' + Math.random()].join('?');
    ajax(uri)
    .then(this._compareVersions.bind(this), function () {
      Ember.Logger.warn('Unable to fetch version information');
    }).then(function () {
      this.set('_timer', Ember.run.later(this, '_periodicWatch', this.get('delay')));
    }.bind(this));
  },
  _timer: null,
  _compareVersions(newVersion) {
    var currentVersion = this.get('version');
    if (newVersion !== currentVersion) {
      hasUpdate = true;
      this.notifyPropertyChange('hasUpdate');
    }
  }
});
