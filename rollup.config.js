import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import css from 'rollup-plugin-css-only';
import copy from 'rollup-plugin-copy';

const production = !process.env.ROLLUP_WATCH;

const Web = {
	input: 'src/entries/web.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'web',
		file: production ? 'public/dist/web.min.js' : 'public/dist/web.js',
	},
	plugins: [
		svelte({
			compilerOptions: {
				dev: !production
			}
		}),
		css({ output: production ?  'web.min.css' : 'web.css' }),
		resolve({
			browser: true,
			dedupe: ['svelte'],
			exportConditions: ['svelte']
		}),
		commonjs(),
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};

const Vendor = {
	input: 'src/entries/vendor.js',
	output: {
			sourcemap: true,
			format: 'iife',
			name: 'vendor',
			file: production ? 'public/dist/vendor.min.js' : 'public/dist/vendor.js',
	},
	plugins: [
		svelte({
			compilerOptions: {
				dev: !production
			}
		}),
	
		css({
			output: 'vendor.min.css', // siempre este nombre
			minify: true              // siempre minificado
		}),
	
		resolve({
			browser: true,
			dedupe: ['svelte'],
			exportConditions: ['svelte']
		}),
	
		commonjs(),
		production && terser(),
	
		copy({
			hook: 'writeBundle',
			targets: [
				{
					src: 'node_modules/font-awesome/fonts/*',
					dest: 'public/fonts/'
				}
			]
		})
	],
	watch: {
			clearScreen: false
	}
};

export default [Web, Vendor, ];