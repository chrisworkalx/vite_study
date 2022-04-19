import { createApp } from './main';

import { renderToString } from 'vue/server-renderer';

export async function render(url) {
  const { app, router } = createApp();

  router.push(url);

  await router.isReady();

  const ctx = {}; //上下文对象

  const html = await renderToString(app, ctx);

  return html;
}
