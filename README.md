## `express`

## How to run

### Register your app

Visit "My apps" console and set

- Name: as you like
- Redirect uris: `http://127.0.0.1:3000/callback`

Set scopes (whitelists) in "Authorization scopes" panel.

- [x] report:eye-color
- [x] report:beard-thickness
- [x] report:morning-person

### Run your app


```
$ npm install
$ export GENOMELINK_CLIENT_ID=<your_client_id>
$ export GENOMELINK_CLIENT_SECRET=<your_client_secret>
$ export GENOMELINK_CALLBACK_URL="http://127.0.0.1:3000/callback"
$ node app.js
```

then, visit `http://127.0.0.1:3000`

Use 'set' for Windows.

## How it works

See https://github.com/AWAKENS-dev/api-oauth-example-flask/issues/1

## Requirements

Node v8.9.0 or later

