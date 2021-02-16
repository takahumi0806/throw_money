import Vue from 'vue'
import App from './App.vue'
import router from './router'
import firebase from 'firebase'
import store from './store/index'
import { firebaseConfig } from './config/firebase-config'

Vue.config.productionTip = false

const settings = { timestampsInSnapshots: true };
firebase.initializeApp(firebaseConfig);
firebase.firestore().settings(settings);

export const db = firebase.firestore();

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')



