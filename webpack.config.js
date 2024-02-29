const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: [
        './app/app.js',
        './app/app.components.js',
        './app/app.constants.js',
        './app/app.controllers.js',
        './app/app.directives.js',
        './app/app.services.js',
        './app/app.values.js',
    ],
    mode: 'development', // TODO
    devtool: 'eval-cheap-source-map', // TODO
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                loader: 'raw-loader',
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: './app/**/*.html', to: './' },
                { from: './images', to: './images' },
                { from: './translate', to: './translate' },
            ],
        }),
        new webpack.ProvidePlugin({
            // Required for bootstrap tooltips to work
            // See also: https://webpack.js.org/plugins/provide-plugin/#usage-jquery-with-angular-1
            'window.jQuery': 'jquery',
        }),
        new HtmlWebpackPlugin({
            template: './index.html',
            // title: 'Opal Registration',
        }),
    ],
};
