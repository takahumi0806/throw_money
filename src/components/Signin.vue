<template>
  <div class="signup">
    <h2>ログイン</h2>
    <p><span>メールアドレス</span><input type="text" placeholder="e-mail" v-model="usermail"></p>
    <p><span>パスワード</span><input type="password" placeholder="Password" v-model="password"></p>
    <button @click="signIn">ログイン</button>
    <p>
    <router-link to="/">新規登録はこちら</router-link>
    </p>
  </div>

</template>
<script>
import firebase from 'firebase'
export default {
  data () {
    return {
      usermail: '',
      password: ''
    }
  },
  methods: {
    signIn: function () {
      firebase.auth().signInWithEmailAndPassword(this.usermail, this.password)
      .then(() => {
        this.$router.push({ path:'Dashboard'})
        this.$store.dispatch('registrationUser', )
      })
      .catch(error => {
        alert(error.message)
      })
    }
  },
}
</script>