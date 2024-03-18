const CopyPlugin = require("copy-webpack-plugin");
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
    // TODO change mode and devtool based on local development vs deployment
    mode: 'development',
    devtool: 'eval-cheap-source-map',
    devServer: {
        client: {
            overlay: {
                errors: false,
                warnings: false,
            },
            progress: true,
            // Docker setting, see: https://stackoverflow.com/questions/69719003/webpack-devserver-hmr-not-working-with-ngrok-docker
            webSocketURL: "auto://0.0.0.0:0/ws",
        },
        compress: true,
        // Docker setting, see: https://www.okteto.com/docs/1.4/tutorials/webpack/
        host: '0.0.0.0',
        hot: false,
        liveReload: true,
        open: true,
        port: 80,
    },
    // Reloads the build in Docker every time a source file is modified (used for local development)
    // See: https://stackoverflow.com/questions/42445288/enabling-webpack-hot-reload-in-a-docker-application
    watchOptions: {
        aggregateTimeout: 500,
        poll: 1000, // Enable polling since fsevents are not supported in Docker
        ignored: /node_modules/,
    },
    // The value of [contenthash] changes when a file's content changes (used for cache busting of various file types)
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
        new CopyPlugin({
            patterns: [
                // File copied for web deployment
                ".htaccess",
            ],
        }),
    ],
};
