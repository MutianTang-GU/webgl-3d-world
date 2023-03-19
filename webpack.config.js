module.exports = {
  module: {
    rules: [
      {
        test: /\.(vert|frag)$/i,
        use: "raw-loader",
      },{
        test: /\.glsl$/,
        loader: 'webpack-glsl-loader'
    }
    ],
  },
};
