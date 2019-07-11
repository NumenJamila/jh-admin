<template>
  <div>
    <Card>
      <div class="search-con search-con-top">
        <Select v-model="searchKey" class="search-col">
          <Option
            v-for="item in columns"
            v-if="item.key !== 'action'&&item.key !== 'index'"
            :value="item.key"
            :key="`search-col-${item.key}`"
          >{{ item.title }}</Option>
        </Select>
        <Input
          @on-change="handleClear"
          clearable
          placeholder="输入关键字搜索"
          class="search-input"
          v-model="searchValue"
        />
        <Button @click="handleSearch" class="search-btn" type="primary">
          <Icon type="search" />搜索
        </Button>
      </div>
      <tables
        ref="tables"
        editable
        v-model="tableData"
        stripe
        border
        :loading="loading"
        :columns="columns"
      />
      <!-- <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button> -->
      <div style="text-align: center;padding:14px 0 0;">
        <Page
          :total="entityCount"
          show-sizer
          :page-size-opts="[5, 10, 20, 50]"
          @on-page-size-change="setPageSize"
          :current="pageNo"
          :page-size="pageSize"
          @on-change="changePage"
        ></Page>
      </div>
      <Button
        v-if="jurisdiction['systemManagement:roleManagement:list']"
        class="search-btn loc"
        @click="newModalFunc"
        type="primary"
      >
        <Icon type="search" />新建用户
      </Button>
      <Modal v-model="newModal" :title="modalTitle">
        <Form :model="formItem" ref="formValidate" :label-width="80" :rules="rules">
          <FormItem label="用户姓名" prop="nickName">
            <Input v-model="formItem.nickName" placeholder="Enter something..."></Input>
          </FormItem>
          <FormItem label="账号名" prop="name">
            <Input v-model="formItem.name" placeholder="Enter something..."></Input>
          </FormItem>
          <FormItem label="密码" v-if="showPassword" prop="password">
            <Input v-model="formItem.password" placeholder="Enter something..."></Input>
          </FormItem>
          <FormItem label="手机" prop="mobile">
            <Input v-model="formItem.mobile" placeholder="Enter something..."></Input>
          </FormItem>
          <FormItem label="邮箱" prop="email">
            <Input v-model="formItem.email" placeholder="Enter something..."></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="text" size="large" @click="modalCancel">取消</Button>
          <Button type="primary" size="large" @click="modalOk">确定</Button>
        </div>
      </Modal>
    </Card>
  </div>
</template>

<script>
import Tables from "_c/tables";
import { industryList } from "@/api/data";
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters({
      jurisdiction: "jurisdiction"
    })
  },
  name: "appraiseConfig",
  components: {
    Tables
  },
  data() {
    let engAndMunName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入登录账户名"));
      } else {
        if (/^[0-9a-zA-Z]+$/.test(value) === false) {
          callback(new Error("请输入英文或数字"));
        }
        callback();
      }
    };
    let isNotEmpty = (rule, value, callback) => {
      if (!value || value.replace(/\s*/g, "") === "") {
        return callback(new Error("不能为空"));
      } else {
        callback();
      }
    };
    return {
      newModal: false,
      modalTitle: "",
      userId: 0,
      showPassword: false,
      formItem: {
        id: 0,
        nickName: "",
        name: "",
        password: "",
        mobile: "",
        email: ""
      },

      rules: {
        password: [
          { required: true, validator: engAndMunName, trigger: "blur" },
          { min: 6, message: "密码长度不可少于6位数", trigger: "blur" }
        ],
        name: [
          { required: true, validator: engAndMunName, trigger: "blur" },
          { min: 2, message: "登录账户名不可少于2个字符", trigger: "blur" },
          { max: 20, message: "登录账户名不可超过20个字符", trigger: "blur" }
        ],
        nickName: [
          { required: true, validator: isNotEmpty, trigger: "blur" },
          { min: 2, message: "用户姓名不可少于2个字符", trigger: "blur" },
          { max: 20, message: "用户姓名不可超过20个字符", trigger: "blur" }
        ]
      },
      pageNo: 1,
      pageSize: 10,
      entityCount: 0,
      loading: false,
      columns: [
        {
          title: "序号",
          type: "index",
          key: "index",
          align: "center",
          width: 60
        },
        {
          title: "名称",
          key: "industryName",
          align: "center"
        },
        {
          title: "操作",
          align: "center",
          key: "action",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                    // icon: 'md-create'
                  },
                  style: {
                    marginRight: "5px",
                    display: !this.jurisdiction[
                      "systemManagement:userManagement:add"
                    ]
                      ? "none"
                      : "inline-block"
                  },
                  on: {
                    click: () => {
                      this.editBus(
                        params.row.id,
                        params.row.nickName,
                        params.row.name,
                        params.row.mobile,
                        params.row.email
                      );
                    }
                  }
                },
                "修改"
              ),
              h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title: "您确定要删除这条数据吗?",
                    transfer: true
                  },
                  on: {
                    "on-ok": () => {
                      this.deleteUser(params.row.id);
                    }
                  }
                },
                [
                  h(
                    "Button",
                    {
                      props: {
                        type: "primary",
                        size: "small"
                        // icon: 'ios-trash'
                      },
                      style: {
                        // marginRight: '5px'
                        display: !this.jurisdiction[
                          "systemManagement:userManagement:delete"
                        ]
                          ? "none"
                          : "inline-block"
                      }
                    },
                    "移除"
                  )
                ]
              )
            ]);
          }
        }
      ],
      tableData: []
    };
  },
  methods: {
    // 唤起新增用户对话框
    newModalFunc() {
      this.modalTitle = "新增用户";
      this.showPassword = true;
      this.formItem = {
        id: 0,
        nickName: "",
        name: "",
        password: "",
        mobile: "",
        email: ""
      };
      this.newModal = true;
    },
    // 唤起修改对话框
    editBus(id, nickName, name, mobile, email) {
      this.modalTitle = "修改用户";
      this.showPassword = false;
      this.formItem = {
        id: id,
        nickName: nickName,
        name: name,
        mobile: mobile,
        email: email
      };
      this.newModal = true;
    },
    // 删除用户
    deleteUser(id) {
      deleteUserData(id)
        .then(res => {
          this.loading = false;
          if (res.data.isSuccess) {
            this.$Message.info("已删除用户");
            this.startToGetUserList();
          } else {
            this.$Message.error("请求失败:" + res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
          this.$Message.error("网络异常");
        });
    },
    // 新建修改用户
    modalOk() {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          if (this.formItem.id == 0) {
            addUserData(this.formItem)
              .then(res => {
                if (res.data.isSuccess) {
                  this.$Message.info("添加成功");
                  this.newModal = false;
                  this.startToGetUserList();
                } else {
                  this.$Message.error("请求失败:" + res.data.msg);
                }
              })
              .catch(res => {
                this.$Message.error("网络异常");
              });
          } else {
            updateUserData(this.formItem)
              .then(res => {
                if (res.data.isSuccess) {
                  this.$Message.info("修改成功");
                  this.newModal = false;
                  this.startToGetUserList();
                } else {
                  this.$Message.error("请求失败:" + res.data.msg);
                }
              })
              .catch(res => {
                this.$Message.error("网络异常");
              });
          }
        } else {
        }
      });
    },
    modalCancel() {
      this.formItem = {
        id: 0,
        nickName: "",
        name: "",
        password: "",
        mobile: "",
        email: ""
      };
      this.newModal = false;
      this.$Message.info("已取消");
    },

    setPageSize(pageSize) {
      this.pageSize = pageSize;
      this.changePage(this.pageNo);
    },
    // 换页
    changePage(pageNo) {
      this.pageNo = pageNo;
      this.IndustryList();
    },
    IndustryList() {
      this.loading = true;
      let data = {
        pageNo: this.pageNo,
        pageSize: this.pageSize
      };
      industryList(data)
        .then(res => {
          this.loading = false;
          if (res.data.isSuccess) {
            this.tableData = res.data.data.entities;
            this.entityCount = res.data.data.entityCount;
          } else {
          }
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
        });
    }
  },
  mounted() {
    this.IndustryList();
  }
};
</script>

<style scoped>
.colClass {
  text-align: center;
}

</style>
