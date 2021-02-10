const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
    resolve: {
        extensions: ['.ts', '.js']
    },
    mode: 'development',
    entry: {
        app: './src/app.ts'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'commonjs',
        filename: '[name].bundle.js'
    },
    plugins: [
        new CleanWebpackPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'babel-loader',
                options: {
                    presets: [['@babel/typescript']],
                    plugins: [
                        '@babel/proposal-class-properties',
                        '@babel/proposal-object-rest-spread'
                    ]
                }
            }
        ]
    },
    stats: {
        colors: true
    },
    externals: /k6(\/.*)?/,
    devtool: 'source-map'
};
