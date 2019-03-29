<style lang="less">
@import "./login.less";
.ivu-card-head {
  text-align: center;
  p {
    font-size: 16px;
  }
}
.ivu-form-item:last-child {
  margin-bottom: 10px;
}
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="md-globe" title="欢迎登录巨合管理系统" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
        </div>
      </Card>
    </div>
    <Spin size="large" fix v-if="this.getLoading"></Spin>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
import store from '@/store';
import { mapGetters } from "vuex";
export default {
  name:"login",
  computed: {
    ...mapGetters({
      getLoading: "getLoading"
    })
  },
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
        } else {
          this.$Message.error("账户或密码错误")
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
