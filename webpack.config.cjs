const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");  // ← NEED THIS
module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "public"),
        filename: "bundle.js"
    },
    mode: "development",
    module: {
    rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
            loader: "babel-loader"
        }
        },
        {
            test: /\.css$/,  // ← ADD THIS RULE for CSS
            use: [MiniCssExtractPlugin.loader, "css-loader"]
        }]
    },
    plugins: [  // ← ADD THIS PLUGINS SECTION
        new MiniCssExtractPlugin({
            filename: "bundle.css",
        }),
    ],
};
