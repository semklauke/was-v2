/// <reference types="vue" />
/// <reference types="vue-router" />
import Vue from 'vue';
import VueRouter from 'vue-router';
import { RouteConfig } from 'vue-router';

import Edit from '@/views/Edit.vue';
import EditWalker from '@/views/EditWalker.vue';
import NewWalker from '@/views/NewWalker.vue';
const Overview = { template: '<div>Overview</div>' }
const Walker = { template: '<div>Walker</div>' }
const Admin = { template: '<div>Admin</div>' }

Vue.use(VueRouter);

const routes: RouteConfig[] = [
    { 
        path: '/edit', 
        component: Edit, 
        name: 'edit',
        children: [
            { path: ':id', component: EditWalker, name: 'edit-walker'}
        ]
    },
    { path: '/new', component: NewWalker, name: 'new-walker' },
    { path: '/overview', component: Overview, name: 'overview' },
    { path: '/walker', component: Walker, name: 'walker' },
    { path: '/admin', component: Admin, name: 'admin' }
];

const router = new VueRouter({
  routes,
});

router.replace({ name: 'edit' });

export default router;
