// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import {terser} from 'rollup-plugin-terser';
import path from 'path';
import os from 'os';

const cpuNums = os.cpus().length;
const standard = {
	input: path.resolve(__dirname, './src/events-proxy.js'),
	output: {
		file: path.resolve(__dirname, './dist/eventsproxy.js'),
		format: 'umd',
		name: 'eventsproxy',
		extend: false,
		sourcemap: false,
	},
	plugins: [
		resolve(),
		commonjs(),
		babel({
			runtimeHelpers: true,
		}),
	]
};

const minSize = {
	input: path.resolve(__dirname, './src/events-proxy.js'),
	output: {
		file: path.resolve(__dirname, './dist/eventsproxy.min.js'),
		format: 'umd',
		name: 'eventsproxy',
		extend: false,
		sourcemap: false,
	},
	plugins: [
		resolve(),
		commonjs(),
		babel({
			runtimeHelpers: true,
		}),
		terser({
			output: {
				comments: false
			},
			include: [/^.+\.js$/],
			exclude: ['node_moudles/**'],
			numWorkers: cpuNums,
			sourcemap: false
		})
	]
};

export default [standard, minSize];