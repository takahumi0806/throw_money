import Vue from 'vue'
import App from './App.vue'
import router from './router'
import firebase from 'firebase'
import store from './store/index'

Vue.config.productionTip = false


const config = {
  apiKey: "AIzaSyBszNssL4XHHtmI7qfxpPwPeilCpmmK3U0",
  authDomain: "throw-maney.firebaseapp.com",
  projectId: "throw-maney",
  storageBucket: "throw-maney.appspot.com",
  messagingSenderId: "696176826365",
  appId: "1:696176826365:web:d430d1af3eb5e32103ab94",
  measurementId: "G-GD5HZ8CKPW"
};

const settings = { timestampsInSnapshots: true };
firebase.initializeApp(config);
firebase.firestore().settings(settings);

export const db = firebase.firestore()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')



