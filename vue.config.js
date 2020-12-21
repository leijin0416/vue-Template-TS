const path = require("path");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; 
const CompressionPlugin = require("compression-webpack-plugin");
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// 分析打包时间
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const resolve = dir => path.join(__dirname, dir);

const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;
const isDev = process.env.NODE_ENV;  //当前的环境
const isProduction = process.env.NODE_ENV === 'production';
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
    'element-ui': 'Element'
  },
  css: [
		'http://lib.baomitu.com/element-ui/2.8.2/theme-chalk/index.css',
	],
  js: [
    'http://lib.baomitu.com/vue/2.6.6/vue.min.js',
    'http://lib.baomitu.com/vue-router/3.0.1/vue-router.min.js',
    'http://lib.baomitu.com/vuex/3.0.1/vuex.min.js',
		'http://lib.baomitu.com/axios/0.18.0/axios.min.js',
		'http://lib.baomitu.com/element-ui/2.8.2/index.js',
  ]
}

const isDevCS = {
  '/api': {
    target: 'http://54.254.93.190:6100',
    changeOrigin: true,
    wx: true,
    pathRewrite: {
      "^/api": "/"
    }
  }
}

module.exports = {
  devServer: {
  https: false,
  open: false,     // 自动开启浏览器
  compress: true,  // 开启压缩
    proxy: isDevCS
  },
  runtimeCompiler: true,
  productionSourceMap: devNeedCdn,
	// eslint-loader 是否在保存的时候检查
	lintOnSave: false, // 可恶的eslint,千万不要开启
	chainWebpack: config => {
		// ============注入cdn start============
		config.plugin('html').tap(args => {
			// 生产环境或本地需要cdn时，才注入cdn
			if (devNeedCdn) args[0].cdn = cdn;
			return args
		})
		// ============注入cdn end==============
		config
			.entry('index')
			.add('babel-polyfill')
      .end()

    // 路径别名alias配置
		config.resolve.alias
			.set("@", resolve("src"))
			.set("@img", resolve("src/assets/images"))
			.set("@css", resolve("src/assets/styles/css"))
      .set("@scss", resolve("src/assets/styles/scss"))

		config
			.plugin('speed-measure-webpack-plugin')
			.use(SpeedMeasurePlugin)
      .end()

		// 生产环境配置
		if (isProduction) {
			// 删除预加载
			config.plugins.delete('preload');
			config.plugins.delete('prefetch');
			// 压缩代码
			config.optimization.minimize(true);
			// 分割代码
			config.optimization.splitChunks({
				chunks: 'all'
			});
		}
	},
	configureWebpack: config => {
    // 用cdn方式引入，则构建时要忽略相关资源
    if (devNeedCdn) config.externals = cdn.externals;
		// 为生产环境修改配置
    if (isProduction) {
      // terser-webpack-plugin 去掉console.log
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
      );
		} else {
      // 为开发环境修改配置...
      config.mode = 'development';
		}
  },
  // 生产环境是否生成 sourceMap 文件
	productionSourceMap: false,
	// css相关配置
	css: {
		// 是否使用css分离插件 ExtractTextPlugin
		extract: true,
		// 开启 CSS source maps?
		sourceMap: false,
		// css预设器配置项
		loaderOptions: {
			// pass options to sass-loader
			sass: {
				// 引入全局变量样式
				data: `@import "@/assets/styles/theme.scss";`
			}
		},
		// 启用 CSS modules for all css / pre-processor files.
		modules: false,
	},
	parallel: require('os').cpus().length > 1
}