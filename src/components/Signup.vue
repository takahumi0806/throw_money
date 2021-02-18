<template>
  <div class="signup">
    <h2>新規登録</h2>
    <p>
      <span>ユーザー名</span>
      <input type="text" placeholder="Username" v-model="userName" />
    </p>
    <p>
      <span>メールアドレス</span>
      <input type="text" placeholder="e-mail" v-model="userMail" />
    </p>
    <p>
      <span>パスワード</span>
      <input type="password" placeholder="Password" v-model="password" />
    </p>
    <button @click="signUp">新規登録</button>
    <p>
      <router-link to="/signin">ログインはこちら</router-link>
    </p>
  </div>
</template>

<script>
export default {
  name: 'Signup',
  data() {
    return {
      userName: '',
      userMail: '',
      password: '',
    };
  },
  methods: {
    signUp() {
      this.$store.dispatch('signUp', {
        userMail: this.userMail,
        password: this.password,
        userName: this.userName,
      });
      setTimeout(() => {
        this.$router.push({ path: 'Dashboard' });
      }, 1000);
    },
  },
};
</script>
