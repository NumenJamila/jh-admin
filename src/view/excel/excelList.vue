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
        @on-delete="handleDelete"
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
        v-if="jurisdiction['home:test2:list']"
        class="search-btn loc"
        @click="newModalFunc"
        type="primary"
      >
        <Icon type="search"/>新建角色
      </Button>
      <Modal
        v-model="newModal"
        :title="modalTitle"
        :loading="modelLoading"
      >
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
  </div>
</template>

<script src="http://libs.baidu.com/jquery/1.9.0/jquery.js"></script>
<script>
import Tables from "_c/tables";
import { getRoleData, addRoleData, deleteRoleData, updateRoleData } from "@/api/data";
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters({
      jurisdiction: "jurisdiction"
    })
  },
  name: "tables_page",
  components: {
    Tables
  },
  data() {
    let chnName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入角色中文名称"));
      } else {
        if (/^[\u4E00-\u9FA5]+$/.test(value) === false) {
          callback(new Error("请输入中文"));
        }

        callback();
      }
    };
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

    var isNotEmpty = (rule, value, callback) => {
      if (!value || value.replace(/\s*/g,"") === "") {
        return callback(new Error(""));
      } else {
        callback();
      }
    };
    return {
      newModal: false,
      modalTitle: "新建角色",
      modelLoading: true,
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
          { required: true, validator: isNotEmpty, trigger: "blur" },
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
                      console.log(params.row.id);
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
          align: "center",
        },
        { title: "创建人", key: "crUserName", align: "center" },
        { title: "创建时间", key: "crTime", align: "center", sortable: true },
        {
          title: "Handle",
          align: "center",
          key: "action",
          render: (h, params) => {
            return h("div",[
              h(
                "Button",
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
                      this.editBus(params.row.id,params.row.roleName,params.row.roleDesc,params.row.enName);
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
                style: {
                  cursor: "pointer"
                },
                attrs: {
                  title: "删除"
                },
                on: {
                  "on-ok": () => {
                    this.deleteRole(params.row.id);
                  }
                }
              },
              [
                h("Icon", {
                  props: {
                    title: "删除",
                    type: "ios-trash",
                    color: "red",
                    size: 24
                  }
                })
              ]
            )
            ])
          }
        }
      ],
      tableData: []
    };
  },
  methods: {
    //唤起新增角色对话框
    newModalFunc() {
      this.modalTitle = "新增角色"
      this.newModal = true
    },
    //唤起修改对话框
    editBus(id,roleName,roleDesc,enName) {
      this.modalTitle = "修改角色"
      this.formItem = {
        id: id,
        roleName: roleName,
        roleDesc: roleDesc,
        enName: enName
      }
      this.newModal = true
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
            this.$Message.error("请求失败");
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
          if(this.formItem.id == 0) {
            addRoleData(this.formItem)
            .then(res => {
              if (res.data.isSuccess) {
                this.$Message.info("添加成功");
                this.newModal = false
                this.startToGetRoleList();
              } else {
                this.$Message.error("添加失败");
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
                this.newModal = false
                this.startToGetRoleList();
              } else {
                this.$Message.error("修改失败");
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
      }
      this.newModal = false
      this.$Message.info("已取消");
    },
    handleDelete(params) {
      console.log(params);
    },

    setPageSize(pageSize) {
      this.pageSize = pageSize;
      console.log(pageSize);
      this.changePage(this.pageNo);
    },
    // 换页
    changePage(pageNo) {
      this.loading = true;
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
            this.$Message.error("请求失败");
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
.loc {
  position: absolute;
  right: 17px;
  top: 26px;
}
</style>
