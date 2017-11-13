const express = require('express');
const genomeLink = require('genomelink-node');

const app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

const scope = 'report:eye-color report:beard-thickness report:morning-person';

app.get('/', function(req, res) {
  const authorizeUrl = genomeLink.OAuth.authorizeUrl({ scope: scope });

  res.render('index', {
    authorize_url: authorizeUrl,
    reports: undefined,
  });
});

app.get('/callback', async function(req, res) {
  // The user has been redirected back from the provider to your registered
  // callback URL. With this redirection comes an authorization code included
  // in the request URL. We will use that to obtain an access token.
  const token = await genomeLink.OAuth.token({ requestUrl: req.url });
  const scopes = scope.split(' ');
  const reports = await Promise.all(scopes.map( async (name) => {
    name = name.replace(/report:/g, '');
    return await genomeLink.Report.fetch({
      name: name,
      population: 'european',
      token: token
    });
  }));

  res.render('index', {
    authorize_url: null,
    reports: reports
  });
});

// Run local server on port 3000.
const port = process.env.PORT || 3000;
const server = app.listen(port, function () {
  console.log('Server running at http://localhost:' + port + '/');
});
