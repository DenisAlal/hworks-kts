/* eslint @typescript-eslint/no-var-requires: "off" */
const path = require("path");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const TsCheckerPlugin = require("fork-ts-checker-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const buildPath = path.resolve(__dirname, "dist");
const srcPath = path.resolve(__dirname, "src");
const isProd = process.env.NODE_ENV === "production";
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const getSettingsForStyles = (withModules = false) => {
  return [
    isProd ? MiniCssExtractPlugin.loader : "style-loader",
    !withModules
      ? "css-loader"
      : {
          loader: "css-loader",
          options: {
            modules: {
              localIdentName: !isProd
                ? "[path][name]__[local]"
                : "[hash:base64]",
            },
          },
        },
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: ["autoprefixer"],
        },
      },
    },
    "sass-loader",
  ];
};

module.exports = {
  devtool: isProd ? "hidden-source-map" : "eval-source-map",
  entry: path.join(srcPath, "index.tsx"),
  target: !isProd ? "web" : "browserslist",
  output: {
    path: buildPath,
    filename: "bundle.js",
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: path.join(srcPath, "index.html"),
    }),
    !isProd && new ReactRefreshWebpackPlugin(),
    isProd &&
      new MiniCssExtractPlugin({
        filename: "[name]-[hash].css",
      }),
    new TsCheckerPlugin(),
  ].filter(Boolean),
  module: {
    rules: [

      {
        test: /\.module\.s?css$/,
        use: getSettingsForStyles(true),
      },
      {
        test: /\.s?css$/,
        exclude: /\.module\.s?css$/,
        use: getSettingsForStyles(),
      },
      {
        test: /\.[tj]sx?$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(png|svg|jpg)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"],
    alias: {
      components: path.join(srcPath, "components"),
      config: path.join(srcPath, "config"),
      styles: path.join(srcPath, "styles"),
      assets: path.join(srcPath, "assets"),
      utils: path.join(srcPath, "utils"),
      lib: path.join(srcPath, "lib"),
      context: path.join(srcPath, "context"),
      interfaces: path.join(srcPath, "interfaces"),
      store: path.join(srcPath, "store"),
    },
  },
  devServer: {
    host: "127.0.0.1",
    port: 9000,
    hot: true,
    historyApiFallback: true,
  },
};
