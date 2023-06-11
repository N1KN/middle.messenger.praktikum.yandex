const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// const isDev = process.env.NODE_ENV === 'development';
const INDEX_FILE = '/src/index.html';

module.exports = (_env, options) => {
  const rootPath = __dirname;
  const mode = options.mode;

  console.log('ROOT_PATH: ', rootPath);
  console.log('MODE: ', mode);

  const isDev = mode === 'development';

  return {
    mode: mode,
    // target: 'web',
    // stats: 'errors-only',
    stats: { children: true, logging: 'verbose' },
    entry: {
      main: path.join(rootPath, '/src/index.ts'),
    },
    devtool: isDev && 'source-map',
    output: {
      clean: true,
      path: path.join(rootPath, '/dist'),
      filename: '[name].[contenthash].js',
      publicPath: '/',
    },
    resolve: {
      extensions: ['.ts', '.js'],
      plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.json' })],
      fallback: {
        fs: false,
        os: false,
        path: false,
      },
    },
    devServer: {
      compress: true,
      port: 3000,
      historyApiFallback: true,
      open: true,
      hot: true,
      client: {
        overlay: false,
      },
    },
    module: {
      rules: [
        {
          test: /\.ts?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                compilerOptions: { noEmit: false },
              },
            },
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
            },
          ],
        },
        {
          test: /\.pcss$/,
          use: [
            {
              loader: 'style-loader',
              options: {
                esModule: false,
              },
            },
            {
              loader: 'css-loader',
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  config: path.join(rootPath, '/postcss.config.js'),
                },
                sourceMap: true,
              },
            },
          ],
        },

        // images
        { test: /\.svg$/, type: 'asset' },
        // {
        //   test: /\.svg$/,
        //   use: ['@svgr/webpack'],
        // },
        {
          test: /\.(html)$/,
          use: {
            loader: 'html-loader',
          },
        },
        {
          test: /\.(woff(2)?|eot|ttf|otf)$/,
          type: 'asset/inline',
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(rootPath, INDEX_FILE),
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
        chunkFilename: '[name].[contenthash].css',
      }),
    ],
  };
};
