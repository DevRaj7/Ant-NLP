const path = require('path');
module.exports = {
    entry: './static/javascript/annotationPage.js',
    output: {
        filename: 'annotationPage.js',
        path: path.resolve(__dirname, 'static/dist/')
    }
}