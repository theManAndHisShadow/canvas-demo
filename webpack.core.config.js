const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    // The input file where your imported class is used
    entry: [
        './src/js/index.jsx',
        './src/js/misc/helpers.js'
    ], 


    output: {
        filename: 'js/chunks/[name].[contenthash].js', // Output file after build
        path: path.resolve(__dirname, './build'),
        publicPath: './',
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader', // Allows use of ES6/ESNext syntax
                },
            },
        ],
    },

    resolve: {
        extensions: ['.js', '.jsx'], 
    },

    plugins:[
        new HtmlWebpackPlugin({
          template: path.resolve(__dirname, './src/index.html'),
        }),

        new CopyWebpackPlugin({
            patterns: [{ 
                from: path.resolve(__dirname, './src/css/'), 
                to: "./css/",
            }],
        }),

        new CleanWebpackPlugin(),
    ],

    optimization: {
        splitChunks: {
          chunks: 'async',
        },
      },

    mode: 'production', // Specify the mode (development/production)
};
