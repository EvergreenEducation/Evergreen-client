const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const logConfig = config => {
    console.log(config);
    return config;
}

logConfig.isMiddleware = true;

module.exports = [
    ['use-babel-config', 'babel.config.json'],
    ['use-eslint-config', '.eslintrc.json'],
    ['use-postcss-config'],
    {
        webpack: config => {
            if (config.mode === 'production') {
                config.plugins = [
                    ...config.plugins,
                    new BundleAnalyzerPlugin({
                        analyzerMode: 'static',
                        reportFilename: 'analyzed-bundle.html'
                    })
                ];
            }

            config.entry = [
                ...config.entry,
                'react-hot-loader/patch',
                './src'
            ];

            config.resolve.alias = {
                ...config.resolve.alias,
                'react-dom': '@hot-loader/react-dom',
            }

            return config;
        }
    },
    logConfig
];
