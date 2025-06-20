const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
    app.use(
        "/shelly",
        createProxyMiddleware({
            target: `http://${settings.duckdns}:${settings.shellyServerPort}`,
            changeOrigin: true,
            pathRewrite: {
                "^/shelly": "", // entfernt /shelly aus dem Pfad
            },
        })
    );
};
