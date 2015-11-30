import { moduleFor, test } from 'ember-qunit';
// This is the one from "app", not from "addon"
// because we want to test the configuration
import UpdateClass from '../../../services/selfupdate';
import ENV from '../../../config/environment';

moduleFor('service:selfupdate', 'Unit | Service | selfupdate allowed');

let UpdateWatcher = UpdateClass.extend();

test('it does nothing if selfupdates are not allowed in conf', function (assert) {
  // Setup, we fake the config
  // and force a false
  const _hasKey = ENV.APP.hasOwnProperty('allowSelfUpdate');
  const _old = ENV.APP.allowSelfUpdate;
  ENV.APP.allowSelfUpdate = false;

  const updateCheck = UpdateWatcher.create();
  updateCheck.set('delay', 0); // Don't wait
  updateCheck.watchUpdates();
  assert.notOk(updateCheck.get('_timer'), 'No timer should be set');

  // Teardown, we restore the original value;
  if (!_hasKey) {
    delete ENV.APP.allowSelfUpdate;
  } else {
    ENV.APP.allowSelfUpdate = _old;
  }
});
