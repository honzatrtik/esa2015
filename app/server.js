import newrelic from 'newrelic';
import throng from 'throng';
import React from 'react';
import Router from 'react-router';
import Location from 'react-router/lib/Location';
import routes from './src/routes.js';
import express from 'express';
import api from './src/apiApp.js';
import Promise from './src/Promise.js';
import ErrorGeneric from './src/components/ErrorGeneric.js';
import { getTypes, getSessions } from './src/api.js';
import { stringify } from './src/utils.js';
import createRedux from './src/createRedux.js';
import { Provider } from 'redux/lib/react';
import DocumentTitle from 'react-document-title';
import state from 'express-state';
import { appUrl, workers } from './src/config.js';
import fs from 'fs';
import { gaUa } from './src/config.js'


function handle(res, data) {
    let { status, html, title, state, redirect } = data;
    status = status || 200;
    if (redirect) {
        return res.redirect(redirect);
    }
    res.expose(state, '__INITIAL_DATA__');
    return res.status(status).send(renderPage(html, title, res.locals.state.toString()));
}

function handleError(res, data) {
    let { status, title, html, error } = data;
    console.warn(error);
    const debug = (process.env.NODE_ENV !== 'production');
    let message = debug && error && error.stack && error.stack.replace(/\n/g, '<br />');
    message = message || 'Internal server error occured. Administrator was notified.';
    status = status || 500;
    title = title || status;
    html = html || React.renderToString(<ErrorGeneric title={title}><div dangerouslySetInnerHTML={{__html: message }}></div></ErrorGeneric>);
    return res.status(status).send(renderPage(html, title));

}

function renderPage(html, title, state) {

    const clientJs = state ? '<script src="/build/client.js"></script>' : '';
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
        <script>
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
            ga('create', '${gaUa}', 'auto');
            ga('_trackPageview');
        </script>
        ${clientJs}
        </body>
        </html>`;
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
                const html = React.renderToString(<Error404 location={location} />);
                return reject({
                    status: 404,
                    title: DocumentTitle.rewind(),
                    html
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
                    status: 200,
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

function start() {

    let app = express();


    app.use('/build', express.static(__dirname + '/build'));
    app.use('/api', api);
    state.extend(app);

    app.get('/test', (req, res) => {
        return res.json('ok');
    });

    app.get('*', (req, res) => {
        getHtml(req, res).then(data => {
            return handle(res, data);
        }).catch(data => {
            data = data instanceof Error ? { error: data } : data;
            return handleError(res, data);
        });
    });


    let server = app.listen(process.env.PORT || 8080, () => {
        const host = server.address().address;
        const port = server.address().port;
        console.log('App listening at http://%s:%s', host, port);
    });
}


throng(start, {
    workers: workers,
    lifetime: Infinity
});


