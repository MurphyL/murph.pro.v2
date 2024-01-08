import { h } from 'vue';

import { createRouter, createWebHashHistory } from 'vue-router'

export default createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: { render() { return h('div', {}, 'home'); } }
    },
    {
      path: '/editor',
      name: 'editor',
      component: { render() { return h('div', {}, 'editor'); } }
    }
  ]
});