const glob = require('glob');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    // The input file where your imported class is used
    entry: {
        'js/core': './src/js/index.js',
    }, 

    output: {
        filename: '[name].js', // Output file after build
        path: path.resolve(__dirname, './build'),
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader', // Allows use of ES6/ESNext syntax
                },
            },
        ],
    },

    plugins:[
        new HtmlWebpackPlugin({
          template: path.resolve(__dirname, './src/index.html'),
          inject: false,
        }),

        new CopyWebpackPlugin({
            patterns: [{ 
                from: path.resolve(__dirname, './src/css/'), 
                to: "./css/",
            }],
        }),

        new CopyWebpackPlugin({
            patterns: [{ 
                from: path.resolve(__dirname, './src/js/misc/'), 
                to: "./js/",
            }],
        }),
      ],

    mode: 'production', // Specify the mode (development/production)
};
