<style lang="less">
@import "./login.less";
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">输入任意用户名和密码即可</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions(['handleLogin', 'loginByAccessToken']),
    handleSubmit ({ name, password }) {
      this.handleLogin({ name, password }).then(res => {
        if (res.data.isSuccess) {
          this.loginByAccessToken(res.data.data).then(resp => {
            this.$router.push({
              name: this.$config.homeName
            })
          })
        }
      })
    }
  }
  //   handleSubmit({ name, password }) {
  //     var that = this;
  //     name = name.trim();
  //     login({
  //       name,
  //       password
  //     })
  //       .then(res => {
  //         if (res.data.isSuccess) {
  //           loginByAccessToken(res.data.data)
  //             .then(resp => {
  //               if (resp.data.isSuccess) {
  //                 that.$router.push({
  //                   path: "/home"
  //                 });
  //               }
  //             })
  //             .catch(err => {
  //               console.log(err);
  //             });
  //         }
  //       })
  //       .catch(err => {
  //         console.log(err);
  //       });
  //   }
  // }
}
</script>

<style>
</style>
