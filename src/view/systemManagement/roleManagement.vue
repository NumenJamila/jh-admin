<template>
  <div>
    <Card>
      <tables
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
        v-if="jurisdiction['systemManagement:roleManagement:add']"
        class="search-btn loc"
        @click="newModalFunc"
        type="primary"
      >
        <Icon type="search"/>新建角色
      </Button>
      <Modal v-model="newModal" :title="modalTitle" :loading="modelLoading">
        <Form :model="formItem" ref="formValidate" :label-width="80" :rules="rules">
          <FormItem label="角色名称" prop="roleName">
            <Input v-model="formItem.roleName" placeholder="Enter something..."></Input>
          </FormItem>
          <FormItem label="描述" prop="roleDesc">
            <Input v-model="formItem.roleDesc" placeholder="Enter something..."></Input>
          </FormItem>
          <FormItem label="英文名" prop="enName">
            <Input v-model="formItem.enName" placeholder="Enter something..."></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="text" size="large" @click="modalCancel">取消</Button>
          <Button type="primary" size="large" @click="modalOk">确定</Button>
        </div>
      </Modal>
    </Card>
    <edit-role
      :roleId="roleId"
      :jurisdiction="jurisdiction"
      :closeDialog="closeEditRole"
      :roleDialogDisplay="roleDialogDisplay"
    ></edit-role>
  </div>
</template>

<script>
import Tables from "_c/tables";
import editRole from "./dialog/editRole.vue";
import {
  getRoleData,
  addRoleData,
  deleteRoleData,
  updateRoleData
} from "@/api/admin";
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters({
      jurisdiction: "jurisdiction"
    })
  },
  name: "roleManagement",
  components: {
    Tables,
    editRole
  },
  data() {
    let engName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入角色英文名称"));
      } else {
        if (/^[A-Za-z]+$/.test(value) === false) {
          callback(new Error("请输入英文"));
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
      roleDialogDisplay: false,
      modalTitle: "新建角色",
      modelLoading: true,
      roleId: 0,
      formItem: {
        id: 0,
        roleName: "",
        roleDesc: "",
        enName: ""
      },

      rules: {
        roleName: [
          { required: true, validator: isNotEmpty, trigger: "blur" },
          { min: 2, message: "角色中文名称不可少于2个字", trigger: "blur" },
          { max: 20, message: "角色中文名称不可超过20个字", trigger: "blur" }
        ],
        enName: [
          { required: true, validator: engName, trigger: "blur" },
          { min: 2, message: "角色英文名称不可少于2个字符", trigger: "blur" },
          { max: 20, message: "角色英文名称不可超过20个字符", trigger: "blur" }
        ],
        roleDesc: [
          {
            required: true,
            validator: isNotEmpty,
            message: "请输入角色备注",
            trigger: "blur"
          },
          { max: 200, message: "角色备注不可超过200个字", trigger: "blur" }
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
          title: "角色名称",
          key: "roleName",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "a",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      if(this.jurisdiction['systemManagement:roleManagement:todo']) {
                        this.editRoleFunc(params.row.id);
                      } else {
                        this.$Message.error("无权限操作")
                      }
                    }
                  }
                },
                params.row.roleName
              )
            ]);
          }
        },
        { title: "描述", key: "roleDesc", align: "center" },
        {
          title: "英文名",
          key: "enName",
          align: "center"
        },
        { title: "创建人", key: "crUserName", align: "center" },
        { title: "创建时间", key: "crTime", align: "center", sortable: true },
        {
          title: "操作",
          align: "center",
          key: "action",
          render: (h, params) => {
            return h("div", [
              // h(
              //   "Button",
              //   {
              //     props: {
              //       type: "primary",
              //       size: "small"
              //     },
              //     style: {
              //       marginRight: "5px"
              //     },
              //     on: {
              //       click: () => {
              //         this.editBus(params.row.id,params.row.roleName,params.row.roleDesc,params.row.enName);
              //       }
              //     }
              //   },
              //   "修改"
              // ),
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small",
                    icon: "md-create"
                  },
                  style: {
                    marginRight: "5px",
                    display: (!this.jurisdiction['systemManagement:roleManagement:update']) ? 'none' : 'inline-block'
                  },
                  on: {
                    click: () => {
                      this.editBus(
                        params.row.id,
                        params.row.roleName,
                        params.row.roleDesc,
                        params.row.enName
                      );
                    }
                  }
                },
                "修改"
              ),
              // h(
              // "Poptip",
              // {
              //   props: {
              //     confirm: true,
              //     title: "您确定要删除这条数据吗?",
              //     transfer: true
              //   },
              //   style: {
              //     cursor: "pointer"
              //   },
              //   attrs: {
              //     title: "删除"
              //   },
              //   on: {
              //     "on-ok": () => {
              //       this.deleteRole(params.row.id);
              //     }
              //   }
              // },
              // [
              //   h("Icon", {
              //     props: {
              //       title: "删除",
              //       type: "ios-trash",
              //       color: "red",
              //       size: 24
              //     }
              //   })
              // ]
              // )

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
                      this.deleteRole(params.row.id);
                    }
                  }
                },
                [
                  h(
                    "Button",
                    {
                      props: {
                        type: "primary",
                        size: "small",
                        icon: "ios-trash"
                      },
                      style: {
                        // marginRight: "5px"
                        display: (params.row.id == 1 || (!this.jurisdiction['systemManagement:userManagement:add'])) ? 'none' : 'inline-block'
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
    // 关闭多功能编辑框
    closeEditRole: function() {
      this.roleDialogDisplay = false;
    },
    //角色管理
    editRoleFunc(id) {
      this.roleId = id;
      this.roleDialogDisplay = true;
    },
    //唤起新增角色对话框
    newModalFunc() {
      this.modalTitle = "新增角色";
      this.formItem = {
        id: 0,
        roleName: "",
        roleDesc: "",
        enName: ""
      };
      this.newModal = true;
    },
    //唤起修改对话框
    editBus(id, roleName, roleDesc, enName) {
      this.modalTitle = "修改角色";
      this.formItem = {
        id: id,
        roleName: roleName,
        roleDesc: roleDesc,
        enName: enName
      };
      this.newModal = true;
    },
    //删除角色
    deleteRole(id) {
      deleteRoleData(id)
        .then(res => {
          this.loading = false;
          if (res.data.isSuccess) {
            this.$Message.info("已删除角色");
            this.startToGetRoleList();
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
    // 新建角色
    modalOk() {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          if (this.formItem.id == 0) {
            addRoleData(this.formItem)
              .then(res => {
                if (res.data.isSuccess) {
                  this.$Message.info("添加成功");
                  this.newModal = false;
                  this.startToGetRoleList();
                } else {
                  this.$Message.error("请求失败:" + res.data.msg);
                }
              })
              .catch(res => {
                this.$Message.error("网络异常");
              });
          } else {
            updateRoleData(this.formItem)
              .then(res => {
                if (res.data.isSuccess) {
                  this.$Message.info("修改成功");
                  this.newModal = false;
                  this.startToGetRoleList();
                } else {
                  this.$Message.error("请求失败:" + res.data.msg);
                }
              })
              .catch(res => {
                this.$Message.error("网络异常");
              });
          }
        } else {
          // setTimeout(() => {
          //   this.modelLoading = false;
          //   this.$nextTick(() => {
          //     this.modelLoading = true;
          //   });
          // }, 1000);
        }
      });
    },
    modalCancel() {
      this.formItem = {
        id: 0,
        roleName: "",
        roleDesc: "",
        enName: ""
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
      this.loading = true;
      this.pageNo = pageNo
      let data = {
        pageNo: pageNo,
        pageSize: this.pageSize
      };
      getRoleData(data)
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
    startToGetRoleList() {
      this.loading = true;
      let data = {
        pageNo: this.pageNo,
        pageSize: this.pageSize
      };
      getRoleData(data)
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
    this.startToGetRoleList();
  }
};
</script>

<style scoped>
.colClass {
  text-align: center;
}
</style>
