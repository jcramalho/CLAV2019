module.exports = {
  transpileDependencies: ["vuetify"],
  lintOnSave: false,
  runtimeCompiler: true,
  devServer: {
    port: '3000',
    proxy: {
      '/engine-rest': {
        target: 'http://localhost:8080/',
        changeOrigin: true,
        pathRewrite: {
        }
      }
    }
  }
};

