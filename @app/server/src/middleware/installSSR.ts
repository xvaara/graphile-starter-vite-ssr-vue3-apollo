import { Express } from "express";
// @ts-ignore
import { Builder, Nuxt } from "nuxt";

const isDev = process.env.NODE_ENV === "development";

// We instantiate Nuxt.js with the options
// @ts-ignore
import config from "@app/client/nuxt.config.js";

config.dev = isDev;
config.hooks = {
  ...config.hooks,
  "vue-renderer": {
    ssr: {
      context(ctx: any) {
        // console.log("vue-renderer:ssr:context called", ctx);
        ctx.nuxt.config.csrfToken = ctx.res.locals.csrfToken
      }
    },
  },
}


export default async function installSSR(app: Express) {
  const nuxt = new Nuxt(config);
    await nuxt.ready();

    // No build in production
    if (isDev) {
      const builder = new Builder(nuxt);
      builder.build();
    }

  app.get("*", async (req, res) => {

    res.locals.csrfToken = req.csrfToken()
    nuxt.render(req, res)
    // app.use(nuxt.render);
  })
}
