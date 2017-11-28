module.exports = {
    entry: {
        main: './src/main.js',
    },
    output: {filename: '../app/assets/javascripts/gameapp/[name].bundle.js'},
    module: {
        rules: [
            {
                test: /\.js$/, 
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: ["transform-async-to-generator", "transform-runtime"],
                        presets: ['env'],
                    }
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        js: {
                            loader: 'babel-loader',
                            options: {
                                plugins: ["transform-async-to-generator", "transform-runtime"],
                                presets: ['env'],
                            }
                        },
                    }
                }
            },
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(jpg|png)$/,
                loaders: 'url-loader'
            },
        ],
        loaders: [
        ]
    },
    node: {
        fs: "empty"
    }
}
