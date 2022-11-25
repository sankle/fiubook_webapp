const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: path.join(__dirname, '/src/index.tsx'),
  devtool: 'inline-source-map',
  output: {
    path: path.join(__dirname, '/dist'),
    publicPath: '/',
    filename: 'bundle.js',
  },
  devServer: {
    static: './dist',
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' }, // to inject the result into the DOM as a style block
          { loader: 'css-modules-typescript-loader' }, // to generate a .d.ts module next to the .css file (also requires a declaration.d.ts with "declare modules '*.css';" in it to tell TypeScript that "import styles from './styles.css';" means to load the module "./styles.css.d.td")
          { loader: 'css-loader', options: { modules: true } }, // to convert the resulting CSS to Javascript to be bundled (modules:true to rename CSS classes in output to cryptic identifiers, except if wrapped in a :global(...) pseudo class)
          // NOTE: The first build after adding/removing/renaming CSS classes fails, since the newly generated .d.ts typescript module is picked up only later
        ],
      },
      {
        test: /\.(png|jpe?g|gif|jp2|webp)$/,
        loader: 'file-loader',
        options: {
          name: 'images/[name].[ext]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.css', '.scss'],
    alias: {
      "@images": path.resolve(__dirname, 'images'),
      "@styles": path.resolve(__dirname, 'src/styles')
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};
