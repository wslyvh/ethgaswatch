const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  console.log("setup proxy...")
  
  app.use('/.netlify/functions/',
    createProxyMiddleware({
        target: 'http://localhost:9000',
        pathRewrite: {
            '^/\\.netlify/functions': ''
        }
    }));
};