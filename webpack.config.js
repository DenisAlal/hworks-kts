const path = require('path')
const buildPath = path.resolve(__dirname, 'dist')
module.exports = {
    entry: path.resolve(__dirname, './index .js'),
    output: {
        path: buildPath,
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.jsx?/,
                use: 'babel'
            }
        ]
    }
}