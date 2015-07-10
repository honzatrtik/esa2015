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
import state from 'express-state';
import { appUrl } from './src/config.js';
import fs from 'fs';

let app = express();

state.extend(app);

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

function renderPage(html, title, state) {
    return `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title}</title>
    <link href="${appUrl}/build/styles.css" rel="stylesheet" />
    <link href="${appUrl}/build/print.css" rel="stylesheet" media="print"/>
  </head>
  <body>
    <div id="app">${html}</div>
    <script>
      ${state}
    </script>
    <script src="/build/client.js"></script>
  </body>
</html>
`
}

function getHtml(req, res) {
    return new Promise((resolve, reject) => {

        const location = new Location(req.path, req.query);
        const redux = createRedux();

        Router.run(routes, location, (error, initialState, transition) => {

            if (transition.redirectInfo) {
                const { pathname, query } = transition.redirectInfo;
                return resolve({
                    redirect: pathname + '?' + require('qs').stringify(query)
                });
            }

            if (!initialState || !initialState.components) {
                return reject({
                    status: 404
                });
            }
            if (error) {
                return reject({
                    status: 500,
                    error
                });
            }

            const promises = initialState.components.filter(component => component.getPromise).map(component => Promise.resolve(component.getPromise(redux.dispatch.bind(redux), initialState, redux.getState.bind(redux))));
            Promise.all(promises).then(() => {
                const html = React.renderToString(
                    <Provider redux={redux}>
                        {() => <Router {...initialState} />}
                    </Provider>
                );

                return resolve({
                    title: DocumentTitle.rewind(),
                    html,
                    state: redux.getState()
                });

            }).catch(error => {
                return reject({
                    status: 500,
                    error
                });
            });

        });
    });
}

app.get('/pdf', (req, res) => {
    const file = __dirname + '/build/esa12th-prague-programme.pdf';
    fs.exists(file, function (exists) {
        if (exists) {
            return res.sendFile(file);
        } else {

            getHtml(req, res).then(data => {
                const { html, title } = data;

                const pdf = require('html-pdf');
                const options = {
                    timeout: 90000,
                    format: 'A4'
                };

                pdf.create(renderPage(html, title), options).toStream(function(err, stream){
                    if (err) throw err;
                    stream.pipe(fs.createWriteStream(file));
                    stream.on('end', () => {
                        return res.sendFile(file);
                    });
                });

            }).catch(data => {
                handleError(res, data.status, data.error);
            });
        }
    });

});

app.get('*', (req, res) => {
    getHtml(req, res).then(data => {
        const { html, title, state, redirect } = data;
        if (redirect) {
            return res.redirect(redirect);
        }
        res.expose(state, '__INITIAL_DATA__');
        return res.send(renderPage(html, title, res.locals.state.toString()));
    }).catch(data => {
        handleError(res, data.status, data.error);
    });
});





let server = app.listen(process.env.PORT || 8080, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});