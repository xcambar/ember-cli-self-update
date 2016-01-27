import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

const newVersion = 'base_version';
let initialVersion, updateCheck, mockId;

function mockVersion(version) {
  Ember.$.mockjax.clear(mockId);
  mockId = Ember.$.mockjax({
    url: new RegExp('/version.json'),
    type: 'GET',
    status: 200,
    responseText: version,
    responseTime: 1
  });
}

moduleFor('service:selfupdate', 'Unit | Service | selfupdate', {
  needs: ['config:environment'],
  beforeEach() {
    mockVersion(newVersion);
    updateCheck = this.subject();
    initialVersion = updateCheck.get('version');
    updateCheck.set('delay', 0); // Don't wait
  },
  afterEach() {
    updateCheck.cancel();
    $.mockjax.clear();
  }
});

test('it does not start automatically', function (assert) {
  assert.notOk(updateCheck.get('_timer'), 'No timer should be set');

  updateCheck.watchUpdates();
  assert.ok(updateCheck.get('_timer'), 'a timer should be set after it starts watching');
});

test('the watcher auto restarts after a fixed delay', function (assert) {
  assert.expect(2);
  updateCheck.watchUpdates();
  const _timer = updateCheck.get('_timer');
  return _timer.then(({ currentCycle })=> {
    assert.notOk(currentCycle === _timer, 'A new cycle should have been given');
    assert.equal(currentCycle, updateCheck.get('_timer'), 'The new cycle has been set');
  });
});

test('the status remains unchanged without a version change', function (assert) {
  assert.expect(1);
  $.mockjax.clear(); // The initial version will be fetched
  updateCheck.watchUpdates();
  return updateCheck.get('_timer').then(()=> {
    assert.notOk(updateCheck.get('hasUpdate'), 'Version did not change, no update available');
  });
});

test('the status updates with a version change', function (assert) {
  assert.expect(1);
  updateCheck.watchUpdates();
  return updateCheck.get('_timer').then(()=> {
    assert.ok(updateCheck.get('hasUpdate'), 'Version did change, an update available');
  });
});

test('it supports rollback', function (assert) {
  assert.expect(2);
  updateCheck.watchUpdates();
  return updateCheck.get('_timer').then(()=> {
    assert.ok(updateCheck.get('hasUpdate'), 'Version did change, an update available');
  }).then(()=> {
    mockVersion(initialVersion);
    return updateCheck.get('_timer');
  }).then(()=> {
    assert.notOk(updateCheck.get('hasUpdate'), 'version has rolled back, mo more update available');
  });
});

test('it is resilient to network errors', function (assert) {
  assert.expect(2);
  Ember.$.mockjax.clear(mockId);
  mockId = Ember.$.mockjax({
    url: new RegExp('/version.json'),
    type: 'GET',
    status: 404,
    responseTime: 1
  });
  updateCheck.watchUpdates();
  var _timer = updateCheck.get('_timer');
  return _timer.then(()=> {
    const _newTimer = updateCheck.get('_timer');
    assert.ok(_newTimer, 'The timer is still running');
    assert.ok(_timer !== _newTimer, 'But it is new cycle');
  });
});


test('The endpoint can be configured', function (assert) {
  assert.expect(1);
  $.mockjax.clear();
  const conf = this.container.lookupFactory('config:environment');
  conf.APP.versionEndpoint = '/__version.json';
  mockId = Ember.$.mockjax({
    url: new RegExp('/__version.json'),
    type: 'GET',
    status: 200,
    responseText: 'NEW',
    responseTime: 1
  });
  updateCheck.watchUpdates();
  var _timer = updateCheck.get('_timer');
  return _timer.then(()=> {
    assert.ok(updateCheck.get('hasUpdate'), 'Endpoint has been reached, a new version is available');
  });
});

test('it exists', function(assert) {
  var service = this.subject();
  assert.ok(service);
});
