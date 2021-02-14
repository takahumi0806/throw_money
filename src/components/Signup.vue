<template>
  <div class="signup">
    <h2>新規登録</h2>
    
    <p><span>ユーザー名</span><input type="text" placeholder="Username" v-model="userName"></p>
    <p><span>メールアドレス</span><input type="text" placeholder="e-mail" v-model="userMail"></p>
    <p><span>パスワード</span><input type="password" placeholder="Password" v-model="password"></p>
    <button @click="signUp">新規登録</button>
    <p>
      <router-link to="/signin">ログインはこちら</router-link>
    </p>
  </div>

</template>

<script>
import firebase from 'firebase'
export default {
  name: 'Signup',
  data () {
    return {
      userName: '',
      userMail: '',
      password: ''
    }
  },
  methods: {
    signUp: function () {
      firebase.auth().createUserWithEmailAndPassword(this.userMail, this.password)
      .then((user) => {
        user.user.updateProfile({
          displayName: this.userName
        });
        const db = firebase.firestore();
        db.settings({
          timestampsInSnapshots: true
        });
        db.collection("user").add({
          id: user.user.uid,
          name: this.userName,
          money: '1000'
        })
        this.$router.push({ path:'Dashboard'})
        this.$store.dispatch('registrationUser', )
      })
      .catch(error => {
        alert(error.message)
      })
      
    }
  }
}
</script>