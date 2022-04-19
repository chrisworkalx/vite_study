import {
  createRouter as _createRouter,
  createWebHistory,
  createMemoryHistory //一般用于服务端渲染
} from 'vue-router';

//import.meta.global内置的方法  可以返回数组
// [key: () => import(/*vue/)]
const pages = import.meta.global('../pages/*.vue');

const routes = Object.keys(pages).map((path) => {
  // page[path] === () => import()
  const name = path.match(/\.\.\/pages(.*)\.vue/)[1].toLocaleLowerCase();
  // console.log(name);
  return {
    path: name === '/home' ? '/' : name,
    component: pages[path]
  };
});

export function createRouter() {
  return _createRouter({
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes
  });
}
