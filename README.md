# Ember-cli-self-update [![TravisCI Badge](https://travis-ci.org/xcambar/ember-cli-self-update.svg)](https://travis-ci.org/xcambar/ember-cli-self-update)

Let your Ember app check for a more recent version of itself.

## What?

This addon offers a service for your Ember applications that periodically
checks if a newer version of your app is available.

It allows you to build a nice UX (not included) for your users so they can
always benefit from the latest version of your code.

## Why?

A classical syndrome in SPAs is that the users never close the tab/window.

It means that there are potentially many versions of your app
running in the wild.

This Ember-cli addon allows you to better limit the number of live versions
by automatically checking that a newer version is available, and
reload the app with the latest version.

## How?

Inject the service where you see fit. Here in the ``ApplicationController`:

```js
//app/controllers/application.js

import Ember from 'ember';

export default Ember.Controller.extend({
  selfupdate: Ember.inject.service(),
  willInitSelfUpdate: function() {
    this.get('selfupdate').watchUpdates();
  }.on('init')
});
```

### Configuration

#### Disable self update

You can also allow/disallow self-updates trough configuration:

```js
//config/environment.js

ENV.APP.allowSelfUpdate = false;

```

The self-updates are disabled __if and only if__
the value of `allowSelfUpdate` is false.

#### Change the endpoint

The endpoint (which is really only the destination of the generated JSON file)
can be configured:

```js
//config/environment.js

ENV.APP.versionEndpoint = 'myVersionFile.json';
```

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
