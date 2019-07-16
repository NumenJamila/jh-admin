<template>
  <div class="edit-role">
    <Modal
      v-model="dialogDisplay"
      title="角色管理"
      width="800"
      @on-cancel="roleDialogClose()"
      @on-visible-change="modalChange()"
      @on-ok="roleDialogClose()"
    >
      <Tabs type="card">
        <TabPane label="权限分配">
          <ul class="role-model-ul">
            <li
              v-for="(model,index) in menuListData"
              :class="activeIndex === index ? 'active' : ''"
              @click="getPermissionData(model.id, index)"
            >
              <a href="#">{{model.name}}</a>
            </li>
          </ul>
          <div class="permissions-list">
            <div v-for="group,index in permissionData" class="permission-item" :key="index">
              <Checkbox
                class="Checkbox"
                v-model="group.hadAll"
                @on-change="handleCheckAll(group)"
              >{{group.name}}</Checkbox>
              <CheckboxGroup
                class="CheckboxGroup"
                v-model="group.select"
                @on-change="checkAllGroupChange(group)"
              >
                <Checkbox
                  class="Checkbox"
                  v-for="p,index in group.permission"
                  :key="index"
                  :label="p.id"
                >
                  <span v-html="p.name"></span>
                </Checkbox>
              </CheckboxGroup>
            </div>
          </div>
        </TabPane>
        <TabPane label="用户管理">
          <Card>
            <Button
              class="search-btn loc"
              @click="newModalFunc"
              type="primary"
            >
              <Icon type="search"/>添加用户
            </Button>
            <Tables
              ref="tables"
              editable
              searchable
              search-place="top"
              v-model="tableData"
              stripe
              border
              :loading="loading"
              :columns="columns"
            />
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
          </Card>
        </TabPane>
      </Tabs>
    </Modal>
    <Modal v-model="newUserModal" title="添加用户" width="620" @on-visible-change="userModalChange()" @on-ok="newUserModalFunc()">
      <Transfer
        :data="data3"
        :target-keys="targetKeys3"
        :list-style="listStyle"
        :render-format="render3"
        :titles="['未关联用户', '待选列表']"
        :operations="['取消','选择']"
        filterable
        @on-change="handleChange3">
      </Transfer>
    </Modal>
  </div>
</template>

<script>
import {
  getFirstMenu,
  getPermission,
  updatePermissionNew,
  getRoleUserList,
  getOtherUsersList,
  deleteRoleUserRel,
  addRoleUsersRel
} from "@/api/admin";
import Tables from "_c/tables";
export default {
  props: ["roleId", "jurisdiction", "roleDialogDisplay", "closeDialog"],
  components: {
    Tables
  },
  data() {
    return {
      data3: [],
      targetKeys3: [],
      listStyle: {
        width: "250px",
        height: "300px"
      },
      newUserModal: false,
      dialogDisplay: false,
      menuListData: [],
      permissionData: [],
      activeIndex: undefined,
      indeterminate: true,
      checkAll: false,
      tableData: [],
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
          title: "用户姓名",
          key: "nickName",
          align: "center"
        },
        {
          title: "账户名",
          key: "userName",
          align: "center"
        },
        {
          title: "手机号",
          key: "mobile",
          align: "center"
        },
        { title: "邮箱", key: "email", align: "center" },
        {
          title: "操作",
          align: "center",
          key: "action",
          render: (h, params) => {
            return h(
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
                    }
                  },
                  "移除"
                )
              ]
            );
          }
        }
      ]
    };
  },
  methods: {
    //单选
    checkAllGroupChange(group) {
      let permissionsArr = [];
      let that = this;
      for (let i = 0; i < this.permissionData.length; i++) {
        permissionsArr = permissionsArr.concat(that.permissionData[i].select);
      }

      if (group.select.length === group.permission.length) {
        group.hadAll = true;
      } else {
        group.hadAll = false;
      }
      updatePermissionNew(this.roleId, permissionsArr.join(","))
        .then(res => {
          if (res.data.isSuccess) {
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
    // 全选
    handleCheckAll(group) {
      if (group.hadAll) {
        group.select = [];
        for (let i = 0; i < group.permission.length; i++) {
          group.select.push(group.permission[i].id);
        }
      } else {
        group.select = [];
      }

      let permissionsArr = [];
      let that = this;
      for (let i = 0; i < this.permissionData.length; i++) {
        permissionsArr = permissionsArr.concat(that.permissionData[i].select);
      }
      updatePermissionNew(this.roleId, permissionsArr.join(","))
        .then(res => {
          if (res.data.isSuccess) {
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
    // 打开对话框触发
    modalChange() {
      this.activeIndex = undefined;
      this.permissionData = [];
      this.getFirstMenuData();
      this.getRoleUserListData();
    },
    // 获取一级菜单
    getFirstMenuData() {
      getFirstMenu()
        .then(res => {
          if (res.data.isSuccess) {
            this.menuListData = res.data.data;
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

    // 关闭多功能编辑框
    roleDialogClose: function() {
      this.closeDialog();
    },
    // 根据一级菜单选择二级菜单及其权限列表
    getPermissionData(id, index) {
      this.activeIndex = index;
      getPermission(id, this.roleId)
        .then(res => {
          if (res.data.isSuccess) {
            this.permissionData = res.data.data;
            for (let i = 0; i < this.permissionData.length; i++) {
              this.permissionData[i].select = [];
              if (this.permissionData[i].permission != null) {
                for (
                  let j = 0;
                  j < this.permissionData[i].permission.length;
                  j++
                ) {
                  if (this.permissionData[i].permission[j].hadPersion) {
                    this.permissionData[i].select.push(
                      this.permissionData[i].permission[j].id
                    );
                  }
                }
              } else {
                this.permissionData.splice(i,1);
              }
            }
          } else {
            this.permissionData = [];
            this.$Message.error("请求失败:" + res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
          this.permissionData = [];
          this.loading = false;
          this.$Message.error("网络异常");
        });
    },
    //
    setPageSize(pageSize) {
      this.pageSize = pageSize;
      this.changePage(this.pageNo);
    },
    // 换页
    changePage(pageNo) {
      this.loading = true;
      this.pageNo = pageNo
      let data = {
        roleId: this.roleId,
        pageNo: pageNo,
        pageSize: this.pageSize
      };
      getRoleUserList(data)
        .then(res => {
          this.loading = false;
          if (res.data.isSuccess) {
            this.tableData = res.data.data.entities;
            this.entityCount = res.data.data.entityCount;
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
    getRoleUserListData() {
      this.loading = true;
      let data = {
        roleId: this.roleId,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      };
      getRoleUserList(data)
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
    },
    // 删除用户
    deleteUser(id) {
      deleteRoleUserRel(id)
        .then(res => {
          this.loading = false;
          if (res.data.isSuccess) {
            this.$Message.info("已删除用户");
            this.getRoleUserListData();
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
    // 唤起新增用户对话框
    newModalFunc() {
      this.newUserModal = true;
    },
    // 获得角色下非关联用户
    getOtherUsersListData() {
      getOtherUsersList(this.roleId)
        .then(res => {
          this.loading = false;
          var mockData = []
          if (res.data.isSuccess) {
            for (let i = 0; i < res.data.data.length; i++) {
                    mockData.push({
                        key: res.data.data[i].id,
                        label: res.data.data[i].nickName,
                        name: res.data.data[i].name
                    });
                }
            this.data3 = mockData
            // this.targetKeys3 = this.data3.filter((item) => item.key > 8).map(item => item.key);
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
    // 唤起新增用户触发
    userModalChange() {
      this.getOtherUsersListData();
    },
    handleChange3(newTargetKeys) {
      this.targetKeys3 = newTargetKeys;
    },
    render3(item) {
      return item.label + " - " + item.name;
    },
    newUserModalFunc() {
      let data = {
        roleId: this.roleId,
        userIds: this.targetKeys3.join(",")
      }
      addRoleUsersRel(data).then(res => {
          this.loading = false;
          if (res.data.isSuccess) {
            this.getRoleUserListData();
          } else {
            this.$Message.error("请求失败:" + res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
          this.$Message.error("网络异常");
        });

    }
  },
  mounted() {
    this.dialogDisplay = this.roleDialogDisplay;
    console.log(this.roleId);
  },
  watch: {
    roleDialogDisplay: function(curValue) {
      this.dialogDisplay = curValue;
    }
  }
};
</script>
<style>

.ivu-tabs-tabpane {
  border: 1px solid #f1f1f1;
}
.role-model-ul {
  width: 168px;
  height: 414px;
  background-color: #eee;
  display: inline-block;
}

.role-model-ul li {
  height: 34px;
  line-height: 34px;
  padding-left: 30px;
  font-size: 14px;
}

.role-model-ul li a {
  color: #666;
}

.role-model-ul li.active {
  background: #ecf6fd;
}

.role-model-ul li.active a {
  color: #00b4ff;
}

.permissions-list {
  padding: 20px 20px;
  display: inline-block;
  width: 598px;
  vertical-align: top;
  height: 416px;
  overflow-y: auto;
}
.permissions-list .permission-item {
  margin-bottom: 10px;
  font-size: 16px;
}
.permissions-list .Checkbox {
  margin-left: 0;
  margin-right: 15px;
}

.permissions-list .CheckboxGroup {
  margin-left: 22px;
  margin-bottom: 10px;
}
</style>
