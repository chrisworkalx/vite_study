// import { createApp } from 'vue';
// import App from './App.vue';
// import { createRouter } from './route';

// createApp(App).use(createRouter()).mount('#app');

//改写服务端渲染
import App from './App.vue';
import { createSSRApp } from 'vue';

import { createRouter } from './route';

export function createApp() {
  const app = createSSRApp(App);
  const router = createRouter();

  app.use(router);

  return {
    app,
    router
  };
}
