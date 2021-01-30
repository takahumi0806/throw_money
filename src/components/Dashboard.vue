<template>
  <div> 
    <table  align="center">
      <tr v-for="(user, key) in current_user" :key="key">
        <td class="name">{{user.name}}さんようこそ！！</td>
        <td>残高:{{user.money}}円</td>
        <td><button @click="logOut">ログアウト</button></td>
      </tr>
    </table>
    <h1>ユーザ一覧</h1>
    <div>
      <table align="center">
        <tr>
          <th class="name">ユーザ名</th>
          <th></th>
          <th></th>
        </tr>
        <tr v-for="(user, key) in users" :key="key">
          <td class="name">{{user.name}}</td>
          <td><button @click="openModal(user.id)">walletを見る</button></td>
          <td><button @click="openSend(user.id)">送る</button></td>
        </tr>
      </table>

      <MyModal @close="closeModal" v-if="modal">
        <div v-for="(user, key) in  money" :key="key">
          <p>{{user.name}}の残高</p>
          <p>{{user.money}}円</p>
        </div>
      </MyModal>

    <MyModal @close="closeModal" v-if="throw_money">
      <div v-for="(user, key) in current_user" :key="key">
        <div>あなたの残高:{{user.money}}</div>
      </div>
        <p>送る金額</p>
      <div><input v-model="gift"></div>
      <template slot="footer">
        <div v-for="(user, key) in money" :key="key">
          <button @click="doSend(user,{current_user})">送信</button>
        </div>
      </template>
    </MyModal>


    </div>
  </div>

</template>

<script>
import firebase from 'firebase'
import MyModal from './MyModal.vue'
export default {
components: { MyModal },
name: 'users',
  data() {
    return {
      users: [],
      id: '',
      current_user: [],
      modal: false,
      throw_money: false,
      gift: '',
      money:[]
    }
  },
  methods: {
    logOut: function () {
      firebase.auth().signOut().then(() => {
     
        this.$router.push({ path:'Signin'})
      }).catch(function(error) {
        // An error happened.
        alert(error.message)
      });
    },
    openModal(user) {
      this.throw_money = false
      this.modal = true
      const db = firebase.firestore()
      db.collection("user").where( "id" , "==", user ).get().then(querySnapshot  => {
        const array = [];
        querySnapshot.forEach(function(doc) {
          array.push(doc.data());
        });
        this.money = array
      })
    },
    closeModal() {
      this.modal = false
      this.throw_money = false
    },
    openSend(){
      this.modal = false
      this.throw_money = true
    },
    doSend(money,users) {
      if (this.gift.length > 0) {
        const mymoney = Number(users.current_user[0].money)
        const money_intger = Number(money.money)
        const gift_intger = Number(this.gift)
        const get_money = money_intger  + gift_intger;
        const give_money = mymoney - gift_intger;
        const userId = users.current_user[0].id
        const db = firebase.firestore()


        
        return db.runTransaction(function(transaction) {
           sfDocRef.get().then(querySnapshot  => {
            const array = [];
            querySnapshot.forEach(function(doc) {
              array.push(doc.id)
            });
            const userRef = db.collection('user').doc(array[0])
            userRef.update({
              money: give_money,
              updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
          })
        })




        //投げ銭あげる側のコード
        //投げ銭もらう側のコード
        db.collection("user").where( "id" , "==", money.id ).get().then(querySnapshot  => {
          const array = [];
          querySnapshot.forEach((doc) => {
            array.push(doc.id)
          });
          const moneyRef = db.collection('user').doc(array[0])
          moneyRef.update({
            money: get_money,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          })
        })
        const result = this.users.filter((value) =>  {
            return value.id == money.id;
        })
        result[0].money = get_money
        this.current_user[0].money = give_money
        this.gift = ''
        this.closeModal()
      } else {
        alert('金額を入力して下さい')
      }
    }
  },
 
  mounted: function() {
    const id = firebase.auth().currentUser.uid
    const db = firebase.firestore()
    const user = firebase.auth().currentUser;
    db.collection('user').get().then(snap => {
      const array = [];
      snap.forEach(doc => {
        if(user.uid!=doc.data().id){
         array.push(doc.data());
        }
      });
      this.users = array
    });
    db.collection("user").where( "id" , "==", id ).get().then(querySnapshot  => {
      const array = [];
      querySnapshot.forEach(function(doc) {
        array.push(doc.data());
      });
      this.current_user = array
    })
    .catch(function(error) {
        alert("Error getting documents: ", error);
    });
  }
}
</script>
<style>
  .name{
    width: 300px;
    text-align:left;
  }
</style>