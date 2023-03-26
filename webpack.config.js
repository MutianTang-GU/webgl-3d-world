module.exports = (env, argv) => {
  return {
    module: {
      rules: [
        {
          test: /\.glsl$/,
          use: {
            loader: "webpack-glsl-minify",
            options: {
              esModule: true,
              includesOnly: argv.mode === "development",
              preserveUniforms: true,
              nomangle: ["transpose"],
            },
          },
        },
      ],
    },
    resolve: {
      extensions: [".glsl"],
    },
  };
};
