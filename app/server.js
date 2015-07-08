import React from 'react';
import Router from 'react-router';
import Location from 'react-router/lib/Location';
import routes from './src/routes.js';
import express from 'express';
import api from './src/apiApp.js';
import Promise from './src/Promise.js';
import { getTypes, getSessions } from './src/api.js';
import { stringify } from './src/utils.js';
import createRedux from './src/createRedux.js';
import { Provider } from 'redux/lib/react';
import DocumentTitle from 'react-document-title';

let app = express();

app.use('/api', api);

app.use('/build', express.static(__dirname + '/build'));

function handleError(res, status, error) {
    const debug = (process.env.NODE_ENV !== 'production');
    if (debug && error && error.stack) {
        res.status(status).send(error.stack.replace(/\n/g, '<br />'));
    } else {
        res.status(status).send('Error: ' + status);
    }
}

function renderPage(html, data) {
    return `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="/build/styles.css" rel="stylesheet" />
    <title>${DocumentTitle.rewind()}</title>
  </head>
  <body>
    <div id="app">${html}</div>
    <script>
      __INITIAL_DATA__ = ${stringify(data)};
    </script>
    <script src="/build/client.js"></script>
  </body>
</html>
`
}

app.get('*', (req, res) => {
    let location = new Location(req.path, req.query);

    let redux = createRedux();

    Router.run(routes, location, (error, initialState, transition) => {

        if (transition.redirectInfo) {
            const { pathname, query } = transition.redirectInfo;
            return res.redirect(pathname + '?' + require('qs').stringify(query));
        }

        if (!initialState || !initialState.components) {
            return handleError(res, 404);
        }
        if (error) {
            return handleError(res, 500, error);
        }

        const promises = initialState.components.filter(component => component.getPromise).map(component => Promise.resolve(component.getPromise(redux.dispatch.bind(redux), initialState, redux.getState.bind(redux))));
        Promise.all(promises).then(() => {
            let html = React.renderToString(
                <Provider redux={redux}>
                    {() => <Router {...initialState} />}
                </Provider>
            );
            return res.send(renderPage(html, redux.getState()));
        }).catch(error => {
            handleError(res, 500, error);
        });

    });
});



let server = app.listen(process.env.PORT || 8080, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});