const path = require('path');

module.exports = {
    devServer: {
        static: path.resolve(__dirname, 'build'),
        historyApiFallback: true, // This allows for routing to be supported
        port: 3000,
    },

    mode: 'development', // Specify the mode (development/production)
};
