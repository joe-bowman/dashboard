const proxy = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(proxy("/graphql", { target: "http://localhost:8080/" }));
  app.use(proxy("/boom", { target: "http://localhost:9191/" }));
};
