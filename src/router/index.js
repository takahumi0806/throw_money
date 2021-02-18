import Vue from 'vue';
import VueRouter from 'vue-router';
import Signup from '../components/Signup';
import Signin from '../components/Signin';
import Dashboard from '../components/Dashboard';
import firebase from 'firebase';
Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Signup',
    component: Signup,
  },
  {
    path: '/signin',
    name: 'Signin',
    component: Signin,
  },
  {
    path: '/Dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  if (requiresAuth) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        next();
      } else {
        next({ name: 'Signin' });
      }
    });
  } else {
    next();
  }
});

export default router;
