const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const paths = require('./paths')
console.log(paths.src)

module.exports = {
  // Where webpack looks to start building the bundle
  entry: [`${paths.src}/server.js`, `${paths.src}/app.js`],
  target: 'node',

  // Where webpack outputs the assets and bundles
  output: {
    path: paths.build,
    filename: '[name].bundle.js',
    publicPath: '/',
    assetModuleFilename: '[name].[hash].[ext]',
  },

  // Customize the webpack build process
  plugins: [
    // Removes/cleans build folders and unused assets when rebuilding
    new CleanWebpackPlugin(),

    // Copies files from target to destination folder
    new CopyWebpackPlugin({
      patterns: [
        {
          from: paths.public,
          to: 'assets',
          globOptions: {
            ignore: ['*.DS_Store'],
          },
          noErrorOnMissing: true,
        },
      ],
    }),

    // Generates an HTML file from a template
    // Generates deprecation warning: https://github.com/jantimon/html-webpack-plugin/issues/1501
    // new HtmlWebpackPlugin({
    //   favicon: `${paths.public}/favicon.png`,
    //   template: `${paths.src}/template.html`, // template file
    //   filename: 'index.html', // output file
    // }),
  ],

  // Determine how modules within the project are treated
  module: {
    rules: [
      // JavaScript: Use Babel to transpile JavaScript files
      { test: /\.js$/, use: ['babel-loader'] },

      // Images: Copy image files to build folder
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i,
        type: 'asset/resource',
      },

      // Fonts and SVGs: Inline files
      { test: /\.(woff(2)?|eot|ttf|otf|svg)$/, type: 'asset/inline' },
    ],
  },

  resolve: {
    modules: [paths.src, '../node_modules'],
    // extensions: ['.js', '.jsx', '.json'],
    // alias: {
    //   '@src': paths.src,
    //   '@scss': `${paths.src}/scss`,
    //   '@fonts': `${paths.src}/fonts`,
    //   '@images': `${paths.src}/images`,
    // },
  },
}
