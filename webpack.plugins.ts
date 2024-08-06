import type IForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
// eslint-disable-next-line import/default
import CopyWebpackPlugin from "copy-webpack-plugin";
// eslint-disable-next-line import/default

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

export const plugins = [
    new ForkTsCheckerWebpackPlugin({
        logger: "webpack-infrastructure"
    }),
    new CopyWebpackPlugin({
        patterns: [
            {from: "src/assets", to: "assets"}
        ]
    })
];
