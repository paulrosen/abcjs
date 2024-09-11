import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'index.js',
  output: {
    dir: 'output',
    format: 'cjs'
  },
  plugins: [commonjs()]
};
