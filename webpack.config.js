const path = require("path");
const nodeExternals = require("webpack-node-externals");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: "development",
    entry: {
        bundle: "./src/index.ts"
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist"),
        clean: true
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {from: "src/assets/audio", to: "assets/audio"},
                {from: "src/assets/svg", to: "assets/svg"},
                {from: "src/assets/images", to: "assets/images"},
                {
                    from: "src/assets/style/*.css",
                    to({context, absoluteFilename}) {
                        return "assets/style/[name][ext]";
                    }
                },
                {from: "src/index.html"}
            ]
        })
    ],
    externals: [nodeExternals()]
};
