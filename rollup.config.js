// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
// import {uglify} from 'rollup-plugin-uglify';
export default {
    input: 'src/events-proxy.js',
    output: [{
        file: 'eventsproxy.js',
        format: 'umd',
        dir: 'dist',
        name: 'eventsproxy'
      }],
    plugins: [
        resolve(),
        babel({
            exclude: 'node_modules/**' // 只编译我们的源代码
        }),
        commonjs(),
        json(),
        // uglify()
    ]
};