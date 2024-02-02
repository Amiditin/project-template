const path = require('path');
const webpack = require('webpack');

module.exports = {
	mode: 'development',
	entry: './index',

	output: {
		libraryTarget: 'umd',
		filename: 'index.js',
		path: path.resolve(__dirname, './dist'),
		publicPath: '/'
	},

	watch: false,
	watchOptions: {
		aggregateTimeout: 1000
	},
	devServer: {
		static: {
			directory: __dirname
		},
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ['@babel/preset-env']
					}
				}
			},
		]
	},
};
