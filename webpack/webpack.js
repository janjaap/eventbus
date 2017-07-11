const path = require('path');
const PolyfillInjectorPlugin = require('webpack-polyfill-injector');

module.exports = {
    entry: './index.js',
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../dist'),
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
        new PolyfillInjectorPlugin({
            polyfills: [
                'Array.prototype.includes',
            ],
            service: true,
        }),
    ],
};
