import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'


Vue.use(Vuex)

// ストアの定義
const store = new Vuex.Store({
  state: {
    current:[],
    user: []
  },
  getters: {
    getUsers(state) {
      return state.user
    },
    getCrrent(state){
      return state.current
    }
  },
  mutations: {
    setGift(state,{gift,id}){
      const giftIntger = Number(gift)
      const moneyIntger = Number(state.current[0].money)
      const idIntger = Number(id.money)
      const newMoney = moneyIntger - giftIntger
      const db = firebase.firestore()
      const array = [];
      const userArray = [];
      db.collection("user").where( "id" , "==", state.current[0].id ).get().then(querySnapshot  => {
        querySnapshot.forEach(function(doc) {
          array.push(doc.id)
        });
        const sfDocRef = db.collection('user').doc(array[0])
        return db.runTransaction(function(transaction) {
          return transaction.get(sfDocRef).then(function(sfDoc) {
            if (Number.isInteger(giftIntger)&&Number.isInteger(moneyIntger)&&Number.isInteger(idIntger)) {
              state.current[0].money=newMoney
              const newPopulation = sfDoc.data().money - giftIntger;
              transaction.update(sfDocRef, {money: newPopulation,
              updatedAt: firebase.firestore.FieldValue.serverTimestamp()});
            }
          });
        });
      })
      db.collection("user").where( "id" , "==", id.id ).get().then(querySnapshot  => {
        querySnapshot.forEach((doc) => {
          userArray.push(doc.id)
        });
        const moneyRef = db.collection('user').doc(userArray[0])
        return db.runTransaction(function(transaction) {
          return transaction.get(moneyRef).then(function(sfDoc) {
            if (Number.isInteger(giftIntger)&&Number.isInteger(moneyIntger)&&Number.isInteger(idIntger)) {
              const newPopulation = Number(sfDoc.data().money) + giftIntger;
              transaction.update(moneyRef, { money: newPopulation,
              updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
            } 
          });
        })
      })
      
    },
    setUser(){
      const db = firebase.firestore()
      const user = firebase.auth().currentUser;
      db.collection('user').get().then(snap => {
      snap.forEach(doc => {
        if(user.uid!=doc.data().id){
          store.state.user.push(doc.data());
        }else{
          store.state.current.push(doc.data());
        }
      });
    });
    }
  },
  actions: { 
    doUser({commit},id) {commit('setUser', {id})},
    doCurrent({commit},{gift,id}) {commit('setGift', {gift,id})}
  },
})


// ストアをエクスポート
export default store