const express = require('express');
const request = require('request');

const app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

const client_id = process.env.GENOMELINK_CLIENT_ID;
const client_secret = process.env.GENOMELINK_CLIENT_SECRET;
const redirect_uri = process.env.GENOMELINK_CALLBACK_URL;
const scope = 'report:eye-color report:beard-thickness report:morning-person';
// const scope = 'report:eye-color report:beard-thickness report:morning-person';
const authorize_url = `https://genomelink.io/oauth/authorize?redirect_uri=${redirect_uri}&client_id=${client_id}&response_type=code&scope=${scope}`;

app.get('/', function(req, res) {
  res.render('index', {
    authorize_url: authorize_url,
    reports: undefined,
  });
});

app.get('/callback', function(req, res) {
  // The user has been redirected back from the provider to your registered
  // callback URL. With this redirection comes an authorization code included
  // in the request URL. We will use that to obtain an access token.
  const authorization_code = req.query.code;

  request.post({
    url: 'https://genomelink.io/oauth/token',
    json: true,
    form: {
      grant_type:    'authorization_code',
      code:          authorization_code,
      client_id:     client_id,
      client_secret: client_secret,
      redirect_uri:  redirect_uri,
    }
  }, (err, httpResponse, body) => {
    if (err) {
      return console.error('failed to fetch token:', err);
    }

    // At this point you can fetch protected resources.
    // So, fetch a protected resource using an OAuth2 token.
    const token =  body.access_token;
    const scopes = body.scope.split(' ');

    const reports = [];

    // TODO: call multiple reports
    scopes.forEach((name, idx) => {
      name = name.replace(/report:/g, '');

      // TODO: async/await foreach API call (?)
      request.get({
        url: `https://genomelink.io/v1/reports/${name}?population=european`,
        json: true,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }, (err, httpResponse, body) => {
        if (err) {
          return console.error('failed to fetch report:', err);
        }
        reports.push(body);
        // TODO: move outside of this callback
        if (idx === scopes.length - 1) {
          res.render('index', {
            authorize_url: authorize_url,
            reports: reports
          });
        }
      });
    });

  });
});

// Run local server on port 3000.
const port = process.env.PORT || 3000;
const server = app.listen(port, function () {
  console.log('Server running at http://localhost:' + port + '/');
});
