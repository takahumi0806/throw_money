<template>
  <div class="signup">
    <h2>新規登録</h2>
    
    <p><span>ユーザー名</span><input type="text" placeholder="Username" v-model="username"></p>
    <p><span>メールアドレス</span><input type="text" placeholder="e-mail" v-model="usermail"></p>
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
      username: '',
      usermail: '',
      password: ''
    }
  },
  methods: {
    signUp: function () {
      firebase.auth().createUserWithEmailAndPassword(this.usermail, this.password)
      .then((user) => {
        user.user.updateProfile({
          displayName:this.username
        });
        var db = firebase.firestore();
        db.settings({
          timestampsInSnapshots: true
        });
        db.collection("user").add({
          id: user.user.uid,
          name: this.username,
          money: '1000'
        })
        this.$router.push({ path:'Dashboard'})
      })
      .catch(error => {
        alert(error.message)
      })
      
    }
  }
}
</script>