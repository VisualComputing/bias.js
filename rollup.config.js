export default {
  entry: 'src/index.js',
  targets: [
    {
      format: 'umd',
      moduleName: 'bias',
      dest: 'build/bias.js'
    },
    {
      format: 'es',
      dest: 'build/bias.module.js'
    }
  ]
};
