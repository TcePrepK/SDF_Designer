import type {Configuration} from "webpack";

import {rules} from "./webpack.rules";
import {plugins} from "./webpack.plugins";
// eslint-disable-next-line import/default

rules.push({
    test: /\.css$/,
    use: [{loader: "style-loader"}, {loader: "css-loader"}]
}, {
    test: /\.scss$/,
    exclude: /node_modules/,
    use: ["style-loader", "css-loader", "sass-loader"]
});

export const rendererConfig: Configuration = {
    module: {
        rules
    },
    plugins: plugins,
    resolve: {
        extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".scss"]
    }
};