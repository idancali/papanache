"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (opts) { return [{
        test: /\.md$/,
        use: [
            {
                loader: 'html-loader'
            },
            {
                loader: 'markdown-loader',
                options: {}
            }
        ]
    }]; });
//# sourceMappingURL=text.js.map