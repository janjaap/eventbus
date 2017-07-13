// module.exports = env => require(`./webpack/webpack.${env}.js`);

const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PolyfillInjectorPlugin = require('webpack-polyfill-injector');
const webpack = require('webpack');
const merge = require('webpack-merge');

module.exports = env => merge({
    entry: {
        app: './index.js',
        pubsub: './src/pubsub/pubsub.js',
        middleware: './src/middleware/middleware.js',
        middleware_manager: './src/middleware/manager.js',
        pubsub_middleware: [
            './src/pubsub/pubsub.js',
            './src/middleware/manager.js',
        ],
    },
    output: {
        filename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, './dist'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|tests)/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            plugins: ['transform-class-properties'],
                            presets: ['env'],
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(['./dist/*']),

        // load polyfills from CDN
        new PolyfillInjectorPlugin({
            polyfills: [
                'Array.prototype.includes',
            ],
            service: true,
        }),

        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html',
            inject: false,
        }),

        // async chunk naming and hashing
        new webpack.NamedChunksPlugin((chunk) => {
            if (chunk.name) {
                return chunk.name;
            }

            return chunk.mapModules(m => path.relative(m.context, m.request)).join('_');
        }),

        // name all modules for consistent content hashing
        new webpack.NamedModulesPlugin(),
    ],
}, require(`./webpack/webpack.${env}.js`));
