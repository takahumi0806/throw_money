<template>
  <div> 
    <table  align="center">
      <tr v-for="(user, key) in doneCurrent" :key="key">
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
        <tr v-for="(user, key) in doneTodosCount" :key="key">
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
        <div v-for="(user, key) in doneCurrent" :key="key">
          <div>あなたの残高:{{user.money}}</div>
        </div>
          <p>送る金額</p>
        <div><input v-model="gift"></div>
        <template slot="footer">
          <div v-for="(user, key) in money" :key="key">
            <button @click="doSend(user)">送信</button>
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
components: {MyModal},
name: 'users',
  data() {
    return {
      modal: false,
      throw_money: false,
      gift: '',
      money:[]
    }
  },
  methods: {
    doSend(user){
      this.$store.dispatch('doCurrent',{gift:this.gift,id:user})
      this.gift = ''
      this.closeModal()
    },
    logOut()  {
      firebase.auth().signOut().then(() => {
        this.$router.push({ path:'Signin'})
        this.$router.go(this.$router.currentRoute.path)
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
  },
  computed: {
    doneTodosCount () {
      return this.$store.getters.getUsers
    },
    doneCurrent(){
      return this.$store.getters.getCrrent
    }
  },
}
</script>
<style>
  .name{
    width: 300px;
    text-align:left;
  }
</style>