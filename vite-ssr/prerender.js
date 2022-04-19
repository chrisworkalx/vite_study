const fs = require('fs');

const path = require('path');

const toAbsolue = (p) => path.resolve(__dirname, p);

const mainifest = require('./dist/static/ssr-manifest.json');

const template = fs.readFileSync(
  toAbsolue('./dist/static/index.html'),
  'utf-8'
);

const { render } = require('./dist/server/entry-server');

const routeToPrerender = fs
  .readdirSync(toAbsolue('./src/pages'))
  .map((file) => {
    const name = file.replace(/\.vue$/, '').toLowerCase();
    return name === 'home' ? '/' : `/${name}`;
  });

(async () => {
  for (const url of routeToPrerender) {
    const appHtml = await render(url, mainifest);
    const html = template.replace('<!--ssr-outlet-->', appHtml);
    const filePath = `dist/static/${url === '/' ? '/index' : url}.html`;

    fs.writeFileSync(toAbsolue(filePath), html); //写入
  }
  fs.unlinkSync(toAbsolue('dist/static/ssr-manifest.json')); //删除文件
})();
