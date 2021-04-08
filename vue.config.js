const webpack = require("webpack");
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; 
const CompressionPlugin = require("compression-webpack-plugin");

const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");  // 分析打包时间
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

function resolve(dir) { return path.join(__dirname, dir) }

const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;
const isProduction = process.env.NODE_ENV !== 'development';
const isDev = process.env.NODE_ENV;            // 当前的环境

/**
 *  打包时切换成 false
 */
const devNeedCdn = isDev === 'production' ? false : true;
const cdn = {
  externals: {
    'vue': 'Vue',
    'vuex': 'Vuex',
    'vue-router': 'VueRouter',
    'axios': 'axios',
    'vue-i18n': 'VueI18n',
    'element-ui': 'ELEMENT',
    'scrollReveal': 'ScrollReveal',
  },
  css: [
		'https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.0/theme-chalk/index.css',
	],
  js: [
    'https://cdn.bootcdn.net/ajax/libs/vue/2.6.9/vue.min.js',
    'https://cdn.bootcdn.net/ajax/libs/vue-router/3.2.0/vue-router.min.js',
    'https://cdn.bootcdn.net/ajax/libs/vuex/3.2.0/vuex.min.js',
		'https://cdn.bootcdn.net/ajax/libs/axios/0.18.0/axios.min.js',
    "https://cdn.bootcdn.net/ajax/libs/vue-i18n/8.9.0/vue-i18n.min.js",
		'https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.0/index.js',
    "https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.0/locale/en.min.js",
    "https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.0/locale/zh-CN.min.js",
    "https://cdn.bootcdn.net/ajax/libs/scrollReveal.js/4.0.9/scrollreveal.min.js"
  ]
}

let baseUrl = "";   // 这里是一个默认的url，可以没有
switch (isDev) {
  case 'development':
    baseUrl = "http://192.168.1.101:10086"  // 这里是本地的请求url
    break
  case 'production':
    baseUrl = "http://xxx.100.210.42:10086"   // 生产环境url
    break
}

const isDevCS = {
  '/admin': {
    target: baseUrl,
    changeOrigin: true,
    wx: true,
    pathRewrite: {
      "^/admin": "/"
    }
  }
}

/**
 *  production：生产环境，development：开发环境
    config.mode = process.env.NODE_ENV
 */
module.exports = {
  runtimeCompiler: true,
  productionSourceMap: devNeedCdn,
  lintOnSave: false,
  devServer: {
    open: false,
    https: false,
    proxy: isDevCS
  },
  chainWebpack: (config) => {
    // ============注入cdn start============
    config.plugin('html').tap(args => {
      // 生产环境或本地需要cdn时，才注入cdn
      if (isProduction || devNeedCdn) args[0].cdn = cdn;
      return args
    });
    // ============注入cdn end==============
    config.entry('main').add('babel-polyfill')
		config.resolve.alias
      .set("@", resolve("src"))
      .set("@img", resolve("src/assets/images"))
      .set("@css", resolve("src/assets/styles/css"))
      .set("@scss", resolve("src/assets/styles/scss"))

    config
      .plugin('speed-measure-webpack-plugin')
      .use(SpeedMeasurePlugin)
      .end()

    if (isDev === 'production') {
      config.plugins.delete('prefetch');
      config.plugins.delete('preload');
    }

  },
  transpileDependencies: [
    'biyi-admin',
  ],
  configureWebpack: config => {
    // 生产环境打包分析体积
    if (isProduction || devNeedCdn) config.externals = cdn.externals;
    if (isDev === 'production') {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
      config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = ['console.log'];
      config.plugins.push(
        // 压缩代码
        new CompressionPlugin({
          algorithm: 'gzip',
          filename: '[path].gz[query]',
          test: productionGzipExtensions,
          threshold: 10240,
          minRatio: 0.8,
          deleteOriginalAssets: false
        }),
        // 体积压缩提示
        new BundleAnalyzerPlugin(),
        // 打包进度显示
        new ProgressBarPlugin()
      )
    }
  },
  css: {
    extract: true,
    loaderOptions: {
      sass: {
        data: `
        @import "@/assets/styles/theme.scss";
        @import "@/assets/styles/mixin.scss";
        @import "@/assets/styles/_var.scss";
        `
      }
    }
  },
  // 第三方插件的选项
  pluginOptions: {}
};
