const CracoAlias = require('craco-alias');

module.exports = {
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: 'tsconfig',
        baseUrl: './src',
        tsConfigPath: './tsconfig.paths.json'
      }
    }
  ],
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Optimize bundle size
      if (env === 'production') {
        webpackConfig.optimization.splitChunks = {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 10,
              enforce: true
            },
            common: {
              name: 'common',
              minChunks: 2,
              priority: 5,
              reuseExistingChunk: true
            }
          }
        };
      }

      // Add performance hints
      webpackConfig.performance = {
        maxAssetSize: 512000,
        maxEntrypointSize: 512000,
        hints: env === 'production' ? 'warning' : false
      };

      return webpackConfig;
    }
  },
  devServer: {
    port: 3000,
    hot: true,
    open: true,
    historyApiFallback: true,
    compress: true,
    client: {
      overlay: {
        errors: true,
        warnings: false
      }
    }
  },
  style: {
    sass: {
      loaderOptions: {
        additionalData: `
          @import "@/styles/variables.scss";
          @import "@/styles/mixins.scss";
        `
      }
    },
    css: {
      loaderOptions: {
        css: {
          modules: {
            localIdentName: '[name]__[local]__[hash:base64:5]'
          }
        }
      }
    }
  }
};