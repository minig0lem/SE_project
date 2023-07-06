const { defineConfig } = require("@vue/cli-service");
const path = require("path");

module.exports = defineConfig({
  outputDir: path.resolve(__dirname, "../backend/public/"),
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    proxy: {
      "/api": {
        target: "https://127.0.0.1:3000/api",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
  chainWebpack: (config) => {
    config.resolve.alias.set(
      "@store",
      path.resolve(__dirname, "src/store/index.js")
    );
    // Add your custom aliases here
  },
});
