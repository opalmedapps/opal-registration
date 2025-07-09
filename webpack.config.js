// SPDX-FileCopyrightText: Copyright (C) 2024 Opal Health Informatics Group at the Research Institute of the McGill University Health Centre <john.kildea@mcgill.ca>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

const CopyPlugin = require("copy-webpack-plugin");
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const config = (env, argv) => {
    console.log('Webpack variables:', env);

    // Parse the mode to use (production or development), specified via webpack as `--mode=value`; default is production
    const mode = argv.mode || 'production';
    console.log(`Webpack mode (${argv.mode ? 'chosen' : 'default'}):`, mode);

    return {
        entry: [
            './app/app.js',
            './app/app.components.js',
            './app/app.constants.js',
            './app/app.controllers.js',
            './app/app.directives.js',
            './app/app.services.js',
            './app/app.values.js',
        ],
        mode: mode,
        devtool: mode === 'development' ? 'eval-cheap-source-map' : undefined,
        optimization: {
            // TODO Minification has been temporarily suspended to fix issues on the deployed site
            //      The following error occurs when clicking Finish on the Terms of Use page: Unknown provider: eProvider <- e
            //      This should be fixed and this "minimize" setting should be deleted (to use defaults based on the mode setting)
            minimize: false,
        },
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
	    allowedHosts: ["mycarexregister.shoprideon.com"],
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
                    test: /\.(html|md)$/,
					loader: 'raw-loader',
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
                $: 'jquery',
                // Required for bootstrap tooltips to work
                // See also: https://webpack.js.org/plugins/provide-plugin/#usage-jquery-with-angular-1
                'window.jQuery': 'jquery',
            }),
            new HtmlWebpackPlugin({
                template: './index.html',
            }),
            new FaviconsWebpackPlugin('./images/favicons/favicon-source.png'),
            new CopyPlugin({
                patterns: [
                    // File copied for web deployment
                    ".htaccess",
                    "LICENSE",
                ],
            }),
        ],
    };
};

module.exports = config;
