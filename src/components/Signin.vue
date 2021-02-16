<template>
  <div class="signup">
    <h2>ログイン</h2>
    <p><span>メールアドレス</span><input type="text" placeholder="e-mail" v-model="userMail"></p>
    <p><span>パスワード</span><input type="password" placeholder="Password" v-model="password"></p>
    <button @click="signIn">ログイン</button>
    <p>
    <router-link to="/">新規登録はこちら</router-link>
    </p>
  </div>

</template>
<script>
export default {
  data () {
    return {
      userMail: '',
      password: ''
    }
  },
  methods: {
    signIn() {
      this.$store.dispatch('signIn', { userMail:this.userMail, password:this.password });
      this.$router.push({ path:'Dashboard' });
    }
  },
}
</script>