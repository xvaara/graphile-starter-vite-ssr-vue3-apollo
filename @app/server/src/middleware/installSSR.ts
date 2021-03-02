import { resolve as pathResolve } from "path";
import { readFileSync } from "fs";
import { Express } from "express";

if (!process.env.NODE_ENV) {
  throw new Error("No NODE_ENV envvar! Try `export NODE_ENV=development`");
}
const isDev = process.env.NODE_ENV === "development";
const isTest = process.env.NODE_ENV === 'test' || !!process.env.VITE_TEST_BUILD


export default async function installSSR(app: Express) {

  const resolve = (p: string) => pathResolve(__dirname+'/../../../client', p)

  const indexProd = !isDev
    ? readFileSync(resolve('../../../client/index.html'), 'utf-8')
    : ''

  const manifest = !isDev
    ? // @ts-ignore
      require('./dist/client/ssr-manifest.json')
    : {}


  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite: any
  const root = resolve('.');
  if (isDev) {
    vite = await require('vite').createServer({
      root,
      logLevel: isTest ? 'error' : 'info',
      server: {
        middlewareMode: true
      }
    })
    // use vite's connect instance as middleware
    app.use(vite.middlewares)
  } else {
    app.use(
      require('serve-static')(resolve('dist/client'), {
        index: false
      })
    )
  }

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl

      let template, render
      if (isDev) {
        // always read fresh template in dev
        template = readFileSync(resolve('index.html'), 'utf-8')
        template = await vite.transformIndexHtml(url, template)
        render = (await vite.ssrLoadModule(resolve('/src/entry-server.js'))).render
      } else {
        template = indexProd
        render = require('./dist/server/entry-server.js').render
      }

      const [appHtml, preloadLinks] = await render(url, manifest)

      const html = template
        .replace(`<!--preload-links-->`, preloadLinks)
        .replace(`<!--app-html-->`, appHtml)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      vite && vite.ssrFixStacktrace(e)
      console.log(e.stack)
      res.status(500).end(e.stack)
    }
  })

}
