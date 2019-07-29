const webpack = require("webpack");
const path = require("path");
module.exports = {
  // 这一层都是VueCLI3项目的配置，会被预先使用，并有必要会赋给webpack，但在这之前，Vue CLI 在一些其他地方也需要用到这个值，而这个值也能做到区分生产环境和开发环境。
  baseUrl: process.env.NODE_ENV === "production" ? "./" : "/",
  css: {
    // need be true for skeleton
    extract: process.env.NODE_ENV !== "test"
  },
  lintOnSave: true,
  configureWebpack: config => {
    // alias
    config.resolve.alias = {
      "@": path.resolve("src"),
      ht: path.resolve("public/ht/ht.js")
    };
    // config.plugins.push(
    //   new webpack.ProvidePlugin({
    //     ht: "ht",
    //     "window.ht": "ht"
    //   })
    // );
    config.externals = {
      ht: "ht"
    };
  }
};
