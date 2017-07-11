const merge = require('webpack-merge');
const webpack = require('webpack');
const webpackBase = require('./webpack.js');

module.exports = merge(webpackBase, {
    plugins: [
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
        }),
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            mangle: {
                screw_ie8: true,
                keep_fnames: true,
            },
            compress: {
                screw_ie8: true,
            },
            comments: false,
        }),
    ],
});
