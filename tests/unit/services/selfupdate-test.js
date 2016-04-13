import { moduleFor, test } from 'ember-qunit';
import FakeServer, { stubRequest } from 'ember-cli-fake-server';

const newVersion = '"base_version"';
let initialVersion, updateCheck;

function mockVersion(version) {
  stubRequest('get', '/version.json', (request)=> {
    request.ok(version);
  });
}

moduleFor('service:selfupdate', 'Unit | Service | selfupdate', {
  needs: ['config:environment'],
  beforeEach() {
    FakeServer.start();
    mockVersion(newVersion);
    updateCheck = this.subject();
    initialVersion = updateCheck.get('version');
    updateCheck.set('delay', 0); // Don't wait
  },
  afterEach() {
    updateCheck.cancel();
    FakeServer.stop();
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
  mockVersion(initialVersion);
  updateCheck.watchUpdates();
  return updateCheck.get('_timer').then(()=> {
    assert.ok(!updateCheck.get('hasUpdate'), 'Version did not change, no update available');
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
    assert.ok(!updateCheck.get('hasUpdate'), 'version has rolled back, mo more update available');
  });
});

test('it is resilient to network errors', function (assert) {
  assert.expect(2);
  stubRequest('get', '/version.json', (request)=> {
    request.notFound();
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
  const conf = this.container.lookupFactory('config:environment');
  conf.APP.versionEndpoint = '/__version.json';
  stubRequest('get', '/__version.json', (request)=> {
    request.ok('NEW');
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
