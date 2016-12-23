import Vue from 'vue';
import VueRouter from 'vue-router';

import './scss/app.scss';

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
		{
			path: '/',
			name: 'index',
			component: require('./components/pages/Index')
		},
		{
			path: '/map',
			name: 'map',
			component: require('./components/pages/Map')
		},
		{
			path: '/heatmap',
			name: 'heatmap',
			component: require('./components/pages/HeatMap')
		}
  ]
});
const app = new Vue({ router });
app.$mount('#app');
