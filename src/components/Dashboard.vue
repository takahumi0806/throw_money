<template>
  <div> 
    <table align="center">
      <tr v-for="(user, key) in doneCurrent" :key="key">
        <td class="name">{{ user.name }}さんようこそ！！</td>
        <td>残高:{{ user.money }}円</td>
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
          <td class="name">{{ user.name }}</td>
          <td><button @click="openUser(user)">walletを見る</button></td>
          <td><button @click="openSend(user)">送る</button></td>           
        </tr>
      </table>

      <MyModal @close="closeModal" v-if="modal">
        <div v-for="(user, key) in  doneMoney" :key="key">
          <p>{{ user.name }}の残高</p>
          <p>{{ user.money }}円</p>
        </div>
      </MyModal>

      <MyModal @close="closeModal" v-if="throwMoney">
        <div v-for="(user, key) in doneCurrent" :key="key">
          <div>あなたの残高:{{ user.money }}</div>
        </div>
        <p>送る金額</p>
        <div><input v-model="gift"></div>
        <template slot="footer">
          <div v-for="(user, key) in doneSend" :key="key">
            <button @click="doSend(user)">送信</button>
          </div>
        </template>
      </MyModal>
    </div>
  </div>

</template>

<script>
import MyModal from './MyModal.vue'
export default {
components: { MyModal },
name: 'users',
  data() {
    return {
      modal: false,
      throwMoney: false,
      gift: '',
    }
  },
  methods: {
    doSend(user) {
      this.$store.dispatch('payMoney', { gift:this.gift, user:user });
      this.gift = ''
      this.closeModal();
    },
    logOut() {
      this.$store.dispatch('logOut')
      this.$router.go({ path: '/signin', force: true });
    },
    openUser(money) {
      this.throwMoney = false
      this.modal = true
      this.$store.dispatch('haveMoney', money);
    },
    closeModal() {
      this.modal = false
      this.throwMoney = false
    },
    openSend(user) {
      this.modal = false
      this.throwMoney = true
      this.$store.dispatch('sendMoney', user);
    },
  },
  computed: {
    doneTodosCount () {
      return this.$store.getters.getUsers;
    },
    doneCurrent() {
      return this.$store.getters.getCrrent;
    },
    doneMoney() {
      return this.$store.getters.getMoney;
    },
    doneSend() {
      return this.$store.getters.getSend;
    }
  },
}
</script>
<style>
  .name {
    width: 300px;
    text-align:left;
  }
</style>