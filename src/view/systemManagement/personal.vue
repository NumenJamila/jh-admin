<template>
  <div>
    <Card>
      <div class="cardMain">
        <div class="Account_Manage_headerImg">
          <!-- 上传头像 -->
          <label>
            <img id="user-icon-img1" src="../../assets/images/wx_photot.jpg">
            <span class="camera-icon"></span>
            <form id="uploadForm" method="post" class="table-form" enctype="multipart/form-data">
              <input id="user-icon" type="file" class="hide" name="file">
            </form>
          </label>
        </div>
        <main>
          <Form :model="formItem" ref="formValidate" :label-width="80" :rules="rules">
            <FormItem label="昵称" prop="nickName">
              <Input v-model="formItem.nickName" placeholder="Enter something..."></Input>
            </FormItem>
            <FormItem label="手机" prop="mobile">
              <Input v-model="formItem.mobile" placeholder="Enter something..."></Input>
            </FormItem>
            <FormItem label="邮箱" prop="email">
              <Input v-model="formItem.email" placeholder="Enter something..."></Input>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="save()">保存</Button>
            </FormItem>
          </Form>
        </main>
      </div>
    </Card>
  </div>
</template>

<script>
import { getUserInfo, updateMyself } from "@/api/user";
import jquery from "@/libs/jquery-1.11.0.min";
import "@/libs/jquery.form.min";
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters({
      jurisdiction: "jurisdiction"
    })
  },
  name: "personal",
  data() {
    var isNotEmpty = (rule, value, callback) => {
      if (!value || value.replace(/\s*/g, "") === "") {
        return callback(new Error("不能为空"));
      } else {
        callback();
      }
    };
    return {
      formItem: {
        id: 0,
        nickName: "",
        mobile: "",
        email: "",
        head: ""
      },
      rules: {
        nickName: [
          { required: true, validator: isNotEmpty, trigger: "blur" },
          { min: 2, message: "昵称不可少于2个字", trigger: "blur" },
          { max: 20, message: "昵称不可超过20个字", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    //
    getUserInfoData() {
      getUserInfo()
        .then(res => {
          if (res.data.isSuccess) {
            this.formItem = {
              id: res.data.data.id,
              nickName: res.data.data.nickName,
              mobile: res.data.data.mobile || "",
              email: res.data.data.email || "",
              head: res.data.data.head || ""
            };
            if (this.formItem.head) {
              $("#user-icon-img1").attr("src", this.formItem.head);
            }
          } else {
            this.$Message.error("请求失败:" + res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
          this.$Message.error("网络异常");
        });
    },
    // 保存按钮
    save() {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          updateMyself(this.formItem)
            .then(res => {
              if (res.data.isSuccess) {
                this.$Message.info("保存成功");
              } else {
                this.$Message.error("请求失败:" + res.data.msg);
              }
            })
            .catch(res => {
              this.$Message.error("网络异常");
            });
        }
      });
    }
  },
  mounted() {
    this.getUserInfoData();
    let that = this;
    function getObjectURL(file) {
      var url = null;
      if (window.createObjectURL != undefined) {
        // basic
        url = window.createObjectURL(file);
      } else if (window.URL != undefined) {
        // mozilla(firefox)
        url = window.URL.createObjectURL(file);
      } else if (window.webkitURL != undefined) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
      }
      return url;
    }
    const publicPath =
      process.env.NODE_ENV === "development"
        ? that.$config.publicPath.dev
        : config.publicPath.pro;
    // 上传头像
    $("#user-icon").on("change", function(e) {
      var objUrl = getObjectURL(this.files[0]); //获取图片的路径，该路径不是图片在本地的路径
      e.preventDefault();
      $("#uploadForm").ajaxSubmit({
        url: publicPath + "/hzy/user/uploadHead",
        success: function(result) {
          if (result.isSuccess) {
            if (objUrl) {
              $("#user-icon-img1").attr("src", objUrl); //将图片路径存入src中，显示出图片
            }
            that.formItem.head = result.data;
            that.save();
          } else {
          }
        },
        error: function() {}
      });
    });
  }
};
</script>

<style <style lang="less" scoped>
.cardMain {
  width: 400px;
}
.Account_Manage_headerImg {
  padding: 0;
  text-align: center;
  width: 100%;
  display: flex;
  -webkit-box-pack: start;
  -webkit-justify-content: flex-start;
  -ms-flex-pack: start;
  justify-content: flex-start;
  height: 80px;
  color: #ffffff;
  font-size: 20px;
  align-items: center;
  // padding-left: 10px;
  label {
    display: inline-block;
    margin: 0 auto;
    position: relative;
    #user-icon-img {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      margin: 0;
      border: 5px solid #fff;
    }
    #user-icon-img1 {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      margin: 0;
      border: 5px solid #fff;
    }
    .camera-icon {
      width: 25px;
      height: 25px;
      position: absolute;
      top: 45px;
      left: 45px;
      background-image: url("../../assets/images/camera.png");
      background-size: 100% 100%;
    }
    .table-form {
      clear: both;
      margin: 0 10px;
      .hide {
        display: none;
      }
    }
  }
}
main {
  width: 100%;
  .fields {
    width: 85%;
    margin: 0 auto;
    .form-group {
      width: 100%;
      .form-item {
        width: 100%;
        font-size: 14px;
        color: #000;
        border-bottom: 1px solid #e5e5e5;
        .item-input {
          padding: 9px 0;
          .item-title {
            display: inline-block;
            color: #333;
            font-size: 14px;
            width: 27%;
          }
          input,
          select {
            color: #666;
            height: 30px;
            width: 70%;
            border: 0;
            font-size: 14px;
            -webkit-appearance: none; //去掉箭头
            background: #fff;
          }
        }
      }
    }
    .clearfix {
      .address-button {
        width: 100%;
        font-size: 14px;
        color: white;
        height: 40px;
        line-height: 40px;
        border-radius: 20px;
        background: linear-gradient(to right, #41d3ff, #3daeff);
        text-align: center;
        margin-top: 16px;
      }
      #login-out {
        width: 100%;
        font-size: 14px;
        color: #666666;
        height: 40px;
        line-height: 40px;
        border-radius: 20px;
        border: 1px solid #ccc;
        text-align: center;
        margin: 12px 0 10px 0;
      }
    }
  }
}
</style>
