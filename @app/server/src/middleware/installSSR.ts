import { GraphileApolloLink } from "@app/lib";
import { Express, static as staticMiddleware } from "express";
import { resolve as pathResolve } from "path";
import { createSsrServer } from "vite-ssr/dev";

if (!process.env.NODE_ENV) {
  throw new Error("No NODE_ENV envvar! Try `export NODE_ENV=development`");
}
const isDev = process.env.NODE_ENV === "development";
const isTest = process.env.NODE_ENV === "test" || !!process.env.VITE_TEST_BUILD;

export default async function installSSR(app: Express) {
  const resolve = (p: string) => pathResolve(__dirname + "/../../../client", p);
  app.use((req, res, next) => {
    const link = new GraphileApolloLink({
      req,
      res,
      postgraphileMiddleware: req.app.get("postgraphileMiddleware"),
    });
    res.locals.GraphileApolloLink = link;
    next();
  });

  if (isDev) {
    const root = resolve(".");
    // Create vite-ssr server in middleware mode.
    const viteServer = await createSsrServer({
      root,
      // ssr: resolve('/src/server.js') // if you need seperate entry file for ssr
      logLevel: isTest ? "error" : "info",
      server: {
        middlewareMode: "ssr",
        watch: {
          // During tests we edit the files too fast and sometimes chokidar
          // misses change events, so enforce polling for consistency
          usePolling: true,
          interval: 100,
        },
      },
    });

    // Use vite's connect instance as middleware
    app.use(viteServer.middlewares);
  } else {
    const dist = resolve(`./dist`);
    // This contains a list of static routes (assets)
    const { ssr } = require(`${dist}/server/package.json`);

    // The manifest is required for preloading assets
    const manifest = require(`${dist}/client/ssr-manifest.json`);

    // This is the server renderer we just built
    const { default: renderPage } = require(`${dist}/server`);
    // Serve every static asset route
    for (const asset of ssr.assets || []) {
      app.use("/" + asset, staticMiddleware(`${dist}/client/` + asset));
    }
    app.use("*", async (request, response) => {
      const url =
        request.protocol + "://" + request.get("host") + request.originalUrl;

      const { html, status, statusText, headers } = await renderPage(url, {
        manifest,
        preload: true,
        // Anything passed here will be available in the main hook
        request,
        response,
        // initialState: { ... } // <- This would also be available
      });

      response.writeHead(status || 200, statusText || headers, headers);
      response.setHeader("Content-Type", "text/html");
      response.end(html);
    });
  }
}
