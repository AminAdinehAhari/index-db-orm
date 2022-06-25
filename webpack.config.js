const path = require("path");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const mode = process.env.NODE_ENV || 'development';



module.exports = {
    entry: path.resolve(__dirname, "src/index.js"),
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: mode === 'production' ?  "ormIndexDB.min.js" : "ormIndexDB.js",
        library: "ormIndexDB",
        libraryTarget: "umd",
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [
                            "@babel/plugin-transform-async-to-generator",
                            "@babel/plugin-transform-runtime"
                        ]
                    }
                }
            },
        ],
    },
    optimization: {
        minimizer: [new UglifyJsPlugin()],
    },
    mode: mode,
};
