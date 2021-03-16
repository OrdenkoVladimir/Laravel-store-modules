const path = require("path");

module.exports = {
    entry: {
        BaseModule: './src/BaseModule.js',
        ItemsListModule: './src/ItemsListModule.js',
        ModelModule: './src/ModelModule.js',
        PaginatedItemsListModule: './src/PaginatedItemsListModule.js',
        Index: './src/index.js',
    },
    output: {
        path: __dirname + '/dist',
        filename: "[name].js"
    }
};