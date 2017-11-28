var path=require('path')
var webpack=require('webpack')

module.exports={
	entry: {
		general: ['babel-polyfill',path.resolve(__dirname,'./script/general.js')]
	},
	output: {
		path: path.resolve(__dirname,'./dist'),
		filename: '[name].js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /(node_modules|dist|media)/
			}
		]
	},
	resolve: {
		extensions: ['*','.js','.json'],
		modules: [
			path.resolve('./script'),
			path.resolve('./node_modules')
		]
	}
}

if(process.env.NODE_ENV==='production'){
	module.exports.plugins=(module.exports.plugins || []).concat([
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"'
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
		sourceMap: true,
			compress: {
				warnings: false
			}
		}),
		new webpack.LoaderOptionsPlugin({
			minimize: true
		})
	])
}