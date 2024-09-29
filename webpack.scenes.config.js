const glob = require('glob');
const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const publicPath = process.env.PUBLIC_URL || '/';

module.exports = {
    // The input file where your imported class is used
    entry: () => {
        const entries = {};

        glob.sync((path.resolve(__dirname, './src/js/scenes/**/scene.jsx'))).forEach(file => {
            const dirName = path.dirname(file).split('/').pop();
            const fileName = path.basename(file, '.jsx');

            entries[`${dirName}/${fileName}`] = file;
        });

        return entries;
    }, 


    resolve: {
        extensions: ['.js', '.jsx'], 
    },

    output: {
        filename: '[name].[contenthash].js', // Output file after build
        path: path.resolve(__dirname, './build/js/scenes'),
        publicPath: publicPath,
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

    plugins: [
        new CleanWebpackPlugin(),
    ],

    optimization: {
        splitChunks: {
          chunks: 'async',
        },
    },

    mode: 'production', // Specify the mode (development/production)
};
