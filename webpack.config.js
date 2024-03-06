const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
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
    devServer: {
        client: {
            overlay: {
                errors: false,
                warnings: false,
            },
            progress: true,
        },
        compress: true,
        host: 'localhost',
        hot: false,
        liveReload: true,
        open: true,
        port: 9100,
        static: {
            directory: './app',
            watch: true,
        },
    },
    // The value of [contenthash] changes when a file's content changes. We use this for cache busting of various files.
    output: {
        filename: '[name].[contenthash].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        assetModuleFilename: 'assets/[contenthash][ext][query]'
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                loader: "html-loader",
                generator: {
                    filename: '[contenthash][ext][query]',
                }
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
                generator: {
                    filename: '[contenthash][ext][query]',
                }
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
        new webpack.ProvidePlugin({
            // Required for bootstrap tooltips to work
            // See also: https://webpack.js.org/plugins/provide-plugin/#usage-jquery-with-angular-1
            'window.jQuery': 'jquery',
        }),
        new HtmlWebpackPlugin({
            template: './index.html',
            // title: 'Opal Registration',
        }),
        new FaviconsWebpackPlugin('./images/favicons/favicon-source.png'),
    ],
};
