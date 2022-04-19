//服务端渲染
const fs = require('fs');
const path = require('path');

const express = require('express');

const { createServer: createViteServer } = require('vite');

const resolve = (p) => path.resolve(__dirname, p);

async function createServer(isProd = process.env.NODE_ENV === 'production') {
  const app = express();
  const indexProd = isProd
    ? fs.readFileSync(resolve('./dist/client/index.html'), 'utf-8')
    : '';

  const manifest = isProd ? require('.dist/client/ssr-mainifest.json') : {};
  //由vite接管前端渲染机制
  // createViteServer会返回一个promise

  let vite;

  if (!isProd) {
    //  开发环境
    vite = await createViteServer({
      server: {
        // middlewareMode: 'html' //纯html渲染 这么写不是ssr渲染只是express接管vue dev-server渲染机制
        middlewareMode: 'ssr' //这是ssr服务端渲染
      }
    });

    app.use(await vite.middlewares);
  } else {
    //生产环境 静态页面托管
    app.use(
      require('serve-static')(resolve('dist/client'), {
        index: false //不打开页面
      })
    );
  }

  app.use('*', async (req, res) => {
    const url = req.originalUrl;
    // console.log(url); //   返回/about路径

    let template;
    let render;

    try {
      if (!isProd) {
        //开发环境
        template = fs.readFileSync(resolve('./index.html'), 'utf-8');

        template = await vite.transformIndexHtml(url, template); //vite去转化html;
        render = (await vite.ssrLoadModule(resolve('./src/entry-server.js')))
          .render;

        /**
       * <!DOCTYPE html>
            <html lang="en">
              <head>
                <script type="module" src="/@vite/client"></script>

                <meta charset="UTF-8" />
                <link rel="icon" href="/favicon.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Vite App</title>
              </head>
              <body>
                <div id="app"></div>
                <script type="module" src="/src/main.js"></script>
              </body>
            </html>
       */
        // console.log(template);
      } else {
        //生产环境
        template = indexProd;
        render = require('./dist/server/entry-server').render;
      }

      //渲染html
      let appHtml;
      try {
        appHtml = await render(url, manifest);
      } catch (e) {}

      console.log(render, '===render');

      console.log(appHtml, '===appHtml');

      const html = template.replace('<!--ssr-outlet-->', appHtml);
      res
        .status(200)
        .set({
          'content-type': 'text/html'
        })
        .end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      console.error(e);
      res.status(500).end(e.message);
    }

    res.end();
  });

  app.listen(3000);
}

createServer();
