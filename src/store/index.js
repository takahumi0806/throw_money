import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'
import { db } from '../main.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    current:[],
    user: [],
    money:[],
    send: []
  },
  getters: {
    getUsers(state) {
      return state.user
    },
    getCrrent(state) {
      return state.current
    },
    getMoney(state) {
      return state.money
    },
    getSend(state) {
      return state.send
    }
  },
  mutations: {
    setUser(state, user) {
      state.user.push(user)
    },
    setCurrent(state, current) {
      state.current.push(current)
    },
    setMoney(state, money) {
      if(0 == state.money.length){
        store.state.money.push(money)
      } else {
        state.money.splice(0, 1)
        store.state.money.push(money)
      }
    },
    setSend(state, money) {
      if(0 == state.send.length) {
        state.send.push(money)
      } else {
        state.send.splice(0, 1)
        state.send.push(money)
      }
    },
    changeCurrent(state, money) {
      state.current[0].money = money
    }
  },
  actions: { 
    registrationUser({ commit }, id) {
      commit('setUser', { id })
    },
    payMoney({ commit }, { gift, user }) {
      const giftIntger = Number(gift)
      const idIntger = Number(user.money)
      const currentUser = firebase.auth().currentUser;
      const array = [];
      const current = [];
      const userArray = [];
      db.collection("user").where("id", "==", currentUser.uid).get().then(querySnapshot  => {
        querySnapshot.forEach((doc) => {
          array.push(doc.id)
        });
        querySnapshot.forEach((doc) => {
          current.push(doc.data())
        });
        const moneyIntger = Number(current[0].money)
        const newMoney = moneyIntger - giftIntger
        const sfDocRef = db.collection('user').doc(array[0])
        return db.runTransaction((transaction) => {
          return transaction.get(sfDocRef).then((sfDoc) => {
            if (Number.isInteger(giftIntger) && Number.isInteger(moneyIntger) && Number.isInteger(idIntger)) {
              commit('changeCurrent', newMoney)
              const throwMoney = sfDoc.data().money - giftIntger;
              transaction.update(sfDocRef, {money: throwMoney,
              updatedAt: firebase.firestore.FieldValue.serverTimestamp()});
            }
          });
        });
      })
      db.collection("user").where( "id", "==", user.id ).get().then(querySnapshot  => {
        querySnapshot.forEach((doc) => {
          userArray.push(doc.id)
        });
        const moneyIntger = Number(current[0].money)
        const moneyRef = db.collection('user').doc(userArray[0])
        return db.runTransaction((transaction) => {
          return transaction.get(moneyRef).then((sfDoc) => {
            if (Number.isInteger(giftIntger) && Number.isInteger(moneyIntger) && Number.isInteger(idIntger)) {
              const throwMoney = Number(sfDoc.data().money) + giftIntger;
              transaction.update(moneyRef, { money: throwMoney,
              updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
            } 
          });
        })
      })
    },
    logOut(){
      firebase.auth().signOut()
    },
    signUp({ commit }, password) {
      firebase.auth().createUserWithEmailAndPassword(password.userMail, password.password)
      .then((user) => {
        db.settings({
          timestampsInSnapshots: true
        });
        db.collection("user").add({
          id: user.user.uid,
          name: password.userName,
          money: '1000'
        })
        const currentUser = firebase.auth().currentUser;
        db.collection('user').get().then(snap => {
          snap.forEach(doc => {
            if(currentUser.uid != doc.data().id) {
              commit('setUser', doc.data());
            } else {
              commit('setCurrent', doc.data());
            }
          });
        });
      })
      .catch(error => {
        console.log(error.message)
      })
    },
    signIn({ commit }, passwaord){
      firebase.auth().signInWithEmailAndPassword(passwaord.userMail, passwaord.password)
      .then(() => {
        const user = firebase.auth().currentUser;
        db.collection('user').get().then(snap => {
          snap.forEach(doc => {
            if(user.uid != doc.data().id) {
              commit('setUser', doc.data());
            } else {
              commit('setCurrent', doc.data());
            }
          });
        });
      })
      .catch(error => {
        console.log(error.message)
      })
    },
    haveMoney({ commit }, money){
      db.collection("user").where("id", "==", money.id).get().then(querySnapshot  => {
        const array = [];
        querySnapshot.forEach((doc) => {
          array.push(doc.data());
        });
        commit('setMoney', array[0])
      })
    },
    sendMoney({ commit }, user){
      db.collection("user").where("id", "==", user.id).get().then(querySnapshot  => {
        const array = [];
        querySnapshot.forEach((doc) => {
          array.push(doc.data());
        });
        commit('setSend', array[0]);
      })
    }
  }
})

export default store