// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import {uglify} from 'rollup-plugin-uglify';

const dev = {
    input: __dirname + '/src/events-proxy.js',
    output: [{
        file: 'eventsproxy.js',
        format: 'umd',
        dir: __dirname + '/dist',
        name: 'eventsproxy'
      }],
    plugins: [
        resolve(),
        commonjs(),

        babel({
            exclude: 'node_modules/**' // 只编译我们的源代码
        }),
    ]
}

const pro = {
    input: __dirname + '/src/events-proxy.js',
    output: [{
        file: 'eventsproxy.min.js',
        format: 'umd',
        dir: __dirname + '/dist',
        name: 'eventsproxy'
      }],
    plugins: [
        resolve(),
        commonjs(),
        babel({
            exclude: 'node_modules/**' // 只编译我们的源代码
        }),
        uglify()
    ]
}

export default [dev, pro];