import Vue from 'vue'
import App from './App.vue'
import router from './router'
import firebase from 'firebase'

Vue.config.productionTip = false


const config = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

const settings = { timestampsInSnapshots: true };
firebase.initializeApp(config);
firebase.firestore().settings(settings);

export const db = firebase.firestore()

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
