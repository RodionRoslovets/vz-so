const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: [
        './js/src/script.js',
    ],
    output: {
        path: path.resolve(__dirname),
        filename: 'js/script.js',
    },
    module: {
        rules: [
            //JavaScript rules
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                      presets: ['@babel/preset-env']
                    }
                }
            },
        ]
    },

    optimization: {
        minimize: true,
    },
};