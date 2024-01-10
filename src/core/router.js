import { createRouter, createWebHashHistory } from 'vue-router';

import dashLayout from '@/plug/layouts/dash-layout.vue';

const documentTitle = document.title;

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: { name: 'kits-dash' },
        },
        {
            path: '/data',
            component: dashLayout,
            props(route) {
                return { hasSidebar: true };
            },
            children: [{
                path: 'json-kits',
                name: 'json-kits',
                meta: {
                    title: 'JSON 工具集'
                },
                component: () => import('@/view/data/json-kits.vue')
            }, {
                path: 'sql-formatter',
                name: 'sql-formatter',
                meta: {
                    title: 'SQL Formatter'
                },
                components: {
                    default: () => import('@/view/sql/sql-formatter.vue'),
                    sidebar: () => import('@/view/sql/sql-sidebar.vue'),
                }
            }]
        },
        {
            path: '/kits',
            component: dashLayout,
            children: [{
                path: 'dash',
                name: 'kits-dash',
                meta: {
                    title: '工具导航'
                },
                component: () => import('@/view/kits-dash.vue')
            }]
        },
    ]
});

router.beforeEach((to) => {
    if (to.meta.title) {
        document.title = `${to.meta.title} | ${documentTitle}`;
    } else {
        document.title = documentTitle;
    }
});

export default router;