const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'production',
    entry: './src/frontend/index.ts',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'frontend/scripts'),
        library: {
            type: 'umd',
            name: 'index',
        },
    },
    devtool: 'source-map',
    resolve: {
        // Add '.ts' as resolvable extensions
        extensions: ['.ts', '.js'],

        // do not insert unecessary code into browser version of the lib
        fallback: {
            // os: require.resolve('os-browserify/browser'),
            // 'node-fetch': false,
            // 'node-abort-controller': false,
        },
    },
    // plugins: [
    //     new webpack.ProvidePlugin({
    //         Buffer: ['buffer', 'Buffer'],
    //     }),
    // ],
    module: {
        rules: [
            // All files with a '.ts' extension will be handled by 'ts-loader'.
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                options: {
                    configFile: path.resolve(__dirname, 'tsconfig.json'),
                },
            },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                test: /\.js$/,
                enforce: 'pre',
                exclude: /node_modules/,
                use: ['source-map-loader'],
            },
        ],
    },
    performance: {
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
    },
};
