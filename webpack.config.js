const path = require("path");
const nodeExternals = require("webpack-node-externals");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: "development",
    entry: {
        bundle: "./src/index.ts",
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "build"),
        clean: true,
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: "res/audio", to: "res/audio" },
                { from: "res/svg", to: "res/svg" },
                { from: "res/images", to: "res/images" },
                // { from: "libs", to: "libs" },
                // { from: 'index.html' },
                // { from: 'src/preload.js' },
                // { from: 'src/renderer.js' },
                { from: "src/index.html" },
                { from: "src/main", to: "main" },
            ],
        }),
    ],
    externals: [nodeExternals()],
};
