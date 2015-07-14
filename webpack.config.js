var webpack = require('webpack');

var plugins = [
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
        'process.env': ['NODE_ENV', 'DATABASE_URL', 'PORT', 'APP_URL', 'DEBUG'].reduce(function(o, k) {
            o[k] = JSON.stringify(process.env[k]);
            return o;
        }, {})
    }),
    new webpack.optimize.UglifyJsPlugin({})
];

module.exports = {
    entry: __dirname + '/app/client.js',
    output: {
        filename: __dirname + '/app/build/client.js'
    },
    plugins: plugins,
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
        ]
    }
};