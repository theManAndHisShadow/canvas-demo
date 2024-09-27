const glob = require('glob');
const path = require('path');

module.exports = {
    // The input file where your imported class is used
    entry: () => {
        const entries = {};

        glob.sync((path.resolve(__dirname, './src/js/scenes/**/scene.js'))).forEach(file => {
            const dirName = path.dirname(file).split('/').pop();
            const fileName = path.basename(file, '.js');

            entries[`${dirName}/${fileName}`] = file;
        });

        return entries;
    }, 

    output: {
        filename: '[name].js', // Output file after build
        path: path.resolve(__dirname, './build/js/scenes'),
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

    mode: 'production', // Specify the mode (development/production)
};
