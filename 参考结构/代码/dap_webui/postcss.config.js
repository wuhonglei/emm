
module.exports = {
    plugins: {
        'postcss-var': {},
        autoprefixer: {},
        'postcss-preset-env': {
            stage: 0,
            features: {
                'custom-properties': {
                    preserve: false
                }
            }
        }
    }
};
