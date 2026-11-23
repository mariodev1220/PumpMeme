import { build } from '/workspace/vend/node_modules/esbuild/lib/main.js';
await build({ entryPoints: ['js/src/main.js'], bundle: true, format: 'iife', target: ['es2019', 'safari15'], minify: true, outfile: 'js/app.js' });
console.log('built');
