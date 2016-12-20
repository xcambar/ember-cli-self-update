import Ember from 'ember';
import ajax from 'ember-ajax';

const {
  computed,
  getOwner,
  Logger,
  RSVP: { Promise },
  run,
  Service
} = Ember;

let hasUpdate = false;

export default Service.extend({
  endpoint: computed(function() {
    return getOwner(this)._lookupFactory('config:environment').APP.versionEndpoint || '/version.json';
  }).readOnly(),
  hasUpdate: computed(()=> hasUpdate).readOnly().volatile(),
  delay: 5 * 60 * 1000, //ms <=> 5min
  _cancelling: false,
  _cancelled: false,

  applyUpdate() {
    window.location.reload(true);
  },

  watchUpdates() {
    if (this.get('_timer')) {
      return;
    }
    this._runAt(0);
  },
  cancel() {
    this.set('_cancelling', true);
  },
  _buildURI() {
    return [this.get('endpoint'), '_r=' + Math.random()].join('?');
  },
  _cyclicWatch() {
    return ajax(this._buildURI())
    .then(run.bind(this, this._compareVersions), (reason)=> {
      Logger.warn('Unable to fetch version information');
      Logger.debug(reason);
    }).then(()=> {
      if (this.get('isDestroyed')) {
        return { currentCycle: null };
      }
      const currentCycle = this._runAt(this.get('delay'));
      return { currentCycle };
    });
  },
  _runAt(delay) {
    if (this.get('_cancelling')) {
      this.setProperties({
        _timer: undefined,
        _cancelling: false,
        _cancelled: true
      });
      return;
    }
    const promise = new Promise((resolve/* , reject */)=> {
      run.later(this, ()=> {
        resolve(this._cyclicWatch());
      }, delay);
    });
    this.set('_timer', promise);
    return promise;
  },
  _timer: null,
  _compareVersions(newVersion) {
    var currentVersion = this.get('version');
    hasUpdate = newVersion !== currentVersion;
    this.notifyPropertyChange('hasUpdate');
  }
});
