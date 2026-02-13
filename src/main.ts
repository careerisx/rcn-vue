import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router/index';

// GitHub Pages SPA fallback: restore route from 404.html redirect
const redirect = new URLSearchParams(window.location.search).get('redirect')
if (redirect) {
  window.history.replaceState(null, '', import.meta.env.BASE_URL + redirect.replace(/^\//, ''))
}

createApp(App).use(router).mount('#app');
