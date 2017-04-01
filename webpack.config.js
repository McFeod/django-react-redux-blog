const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const SOURCE_DIR = path.join(__dirname, 'client');

module.exports = {
    entry: {
        comments: path.join(SOURCE_DIR, 'app.jsx'),
        base: path.join(SOURCE_DIR, 'load_bootstrap.js'),
    },
    output: {
        path: path.join(__dirname, 'static'),
        filename: '[name].js'
    },
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'stage-0', 'react']
                }
            },
            {
                test: /\.css$/,
                exclude: SOURCE_DIR,
                use: ExtractTextPlugin.extract({
                  fallback: 'style-loader',
                  use: 'css-loader'
                })
            },
            {
                test: /\.css$/,
                include: SOURCE_DIR,
                use: [ 'style-loader', 'css-loader' ]
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file-loader?name=fonts/[name].[ext]'
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('[name].css'),
        new webpack.ProvidePlugin({
            $: "jquery",
            jquery: "jquery",
            "window.jQuery": "jquery",
            jQuery:"jquery"
        })
    ],
};