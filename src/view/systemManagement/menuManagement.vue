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
        v-if="jurisdiction['systemManagement:menuManagement:add']"
        class="search-btn loc"
        @click="newModalFunc"
        type="primary"
      >
        <Icon type="search"/>新建一级菜单
      </Button>
      <Modal v-model="newModal" :title="modalTitle" :loading="modelLoading">
        <Form :model="formItem" ref="formValidate" :label-width="80" :rules="rules">
          <FormItem label="名称" prop="name">
            <Input v-model="formItem.name" placeholder="Enter something..."></Input>
          </FormItem>
          <FormItem label="描述" prop="menuDesc">
            <Input v-model="formItem.menuDesc" placeholder="Enter something..."></Input>
          </FormItem>
          <FormItem label="菜单图标" prop="menuIcon">
            <Input v-model="formItem.menuIcon" placeholder="Enter something..."></Input>
          </FormItem>
          <FormItem label="路由名称" prop="menuUrl">
            <Input v-model="formItem.menuUrl" placeholder="Enter something..."></Input>
          </FormItem>
          <!-- <FormItem label="编码" prop="menuCode">
            <Input v-model="formItem.menuCode" placeholder="Enter something..."></Input>
          </FormItem>-->
          <FormItem label="排序" prop="sort">
            <Input v-model="formItem.sort" placeholder="Enter something..."></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="text" size="large" @click="modalCancel">取消</Button>
          <Button type="primary" v-if="jurisdiction['systemManagement:menuManagement:add']"  size="large" @click="modalOk">确定</Button>
        </div>
      </Modal>
    </Card>
  </div>
</template>

<script>
import Tables from "_c/tables";
import {
  addMenuData,
  deleteMenuData,
  updateMenuData,
  getMenuData
} from "@/api/admin";
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters({
      jurisdiction: "jurisdiction"
    })
  },
  name: "menuManagement",
  components: {
    Tables
  },
  data() {
    let isNum = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("不能为空"));
      } else {
        if (/^[0-9]+$/.test(value) === false) {
          callback(new Error("请输入数字"));
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
      modalTitle: "新建一级菜单",
      modelLoading: true,
      formItem: {
        id: undefined,
        name: "",
        menuDesc: "",
        menuIcon: "",
        parentCode: "",
        menuCode: "",
        menuUrl: "",
        parentId: 0,
        sort: "",
        level: "1"
      },

      rules: {
        name: [
          { required: true, validator: isNotEmpty, trigger: "blur" },
          { min: 2, message: "菜单名称不可少于2个字", trigger: "blur" },
          { max: 6, message: "菜单名称不可超过6个字", trigger: "blur" }
        ],
        menuIcon: [{ required: true, validator: isNotEmpty, trigger: "blur" }],
        menuUrl: [{ required: true, validator: isNotEmpty, trigger: "blur" }],
        sort: [{ required: true, validator: isNum, trigger: "blur" }],
        menuDesc: [
          {
            required: true,
            validator: isNotEmpty,
            message: "请输入菜单备注",
            trigger: "blur"
          },
          { max: 20, message: "菜单备注不可超过20个字", trigger: "blur" }
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
          key: "name",
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
                      this.addTwoMenu(
                        params.row.id,
                        params.row.level,
                        params.row.menuCode
                      );
                    }
                  }
                },
                params.row.name
              )
            ]);
          }
        },
        { title: "描述", key: "menuDesc", align: "center" },
        { title: "菜单图标", key: "menuIcon", align: "center" },
        { title: "编码", key: "menuCode", align: "center" },
        { title: "路由名称", key: "menuUrl", align: "center" },
        { title: "排序", key: "sort", align: "center", width: "50" },
        { title: "父级名称", key: "parentName", align: "center" },
        {
          title: "路由级别",
          key: "level",
          align: "center",
          width: "100",
          sortable: true
        },
        {
          title: "操作",
          align: "center",
          key: "action",
          width: "200",
          render: (h, params) => {
            // return h('div', [
            //   h(
            //     'Button',
            //     {
            //       props: {
            //         type: 'primary',
            //         size: 'small'
            //       },
            //       style: {
            //         marginRight: '5px'
            //       },
            //       on: {
            //         click: () => {
            //           this.editBus(
            //             params.row.id,
            //             params.row.parentId,
            //             params.row.name,
            //             params.row.menuDesc,
            //             params.row.menuIcon,
            //             params.row.menuUrl,
            //             params.row.menuCode,
            //             params.row.sort,
            //             params.row.level
            //           )
            //         }
            //       }
            //     },
            //     '修改'
            //   ),
            return h("div", [
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
                    display: (!this.jurisdiction['systemManagement:menuManagement:update']) ? 'none' : 'inline-block'
                  },
                  on: {
                    click: () => {
                      this.editBus(
                        params.row.id,
                        params.row.parentId,
                        params.row.name,
                        params.row.menuDesc,
                        params.row.menuIcon,
                        params.row.menuUrl,
                        params.row.menuCode,
                        params.row.sort,
                        params.row.level
                      );
                    }
                  }
                },
                "修改"
              ),
              // h(
              //   'Poptip',
              //   {
              //     props: {
              //       confirm: true,
              //       title: '您确定要删除这条数据吗?',
              //       transfer: true
              //     },
              //     style: {
              //       cursor: 'pointer'
              //     },
              //     attrs: {
              //       title: '删除'
              //     },
              //     on: {
              //       'on-ok': () => {
              //         this.deteleMenu(params.row.id)
              //       }
              //     }
              //   },
              //   [
              //     h('Icon', {
              //       props: {
              //         title: '删除',
              //         type: 'ios-trash',
              //         color: 'red',
              //         size: 24
              //       }
              //     })
              //   ]
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
                      this.deteleMenu(params.row.id);
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
                        display: (!this.jurisdiction['systemManagement:menuManagement:delete']) ? 'none' : 'inline-block'
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
    // 唤起新增二级菜单
    addTwoMenu(id, level, menuCode) {
      if (level === 2) {
        this.$Message.error("二级菜单无法添加子菜单");
      } else {
        this.formItem = {
          id: undefined,
          name: "",
          menuDesc: "",
          menuIcon: "",
          menuCode: "",
          parentCode: menuCode,
          menuUrl: "",
          parentId: id,
          sort: "",
          level: 2
        };
        this.modalTitle = "新增二级菜单";
        this.newModal = true;
      }
    },
    // 唤起新增一级菜单对话框
    newModalFunc() {
      this.formItem = {
        id: undefined,
        name: "",
        menuDesc: "",
        menuIcon: "",
        menuCode: "",
        parentCode: "",
        menuUrl: "",
        parentId: 0,
        sort: "",
        level: 1
      };
      this.modalTitle = "新增一级菜单";
      this.newModal = true;
    },
    // 唤起修改对话框
    editBus(
      id,
      parentId,
      name,
      menuDesc,
      menuIcon,
      menuUrl,
      menuCode,
      sort,
      level
    ) {
      this.modalTitle = "修改菜单";
      this.formItem = {
        id: id,
        name: name,
        menuDesc: menuDesc,
        menuIcon: menuIcon,
        menuUrl: menuUrl,
        parentId: parentId,
        sort: sort,
        level: level
      };
      if (this.formItem.parentId === 0) {
        // this.formItem.menuCode = this.formItem.menuUrl
      } else {
        this.formItem.parentCode = menuCode.split(":")[0];
      }
      this.newModal = true;
    },
    // 删除菜单
    deteleMenu(id) {
      deleteMenuData(id)
        .then(res => {
          this.loading = false;
          if (res.data.isSuccess) {
            this.$Message.info("已删除角色");
            this.startToGetMenuList();
          } else {
            this.$Message.error("请求失败：" + res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
          this.$Message.error("网络异常");
        });
    },
    // 新建、修改菜单
    modalOk() {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          if (!this.formItem.id || this.formItem.id === undefined) {
            if (this.formItem.parentId === 0) {
              this.formItem.menuCode = this.formItem.menuUrl;
            } else {
              this.formItem.menuCode =
                this.formItem.parentCode + ":" + this.formItem.menuUrl;
            }
            addMenuData(this.formItem)
              .then(res => {
                if (res.data.isSuccess) {
                  this.$Message.info("添加成功");
                  this.newModal = false;
                  this.startToGetMenuList();
                } else {
                  this.$Message.error("请求失败:" + res.data.msg);
                }
              })
              .catch(res => {
                this.$Message.error("网络异常");
              });
          } else {
            if (this.formItem.parentId === 0) {
              this.formItem.menuCode = this.formItem.menuUrl;
            } else {
              this.formItem.menuCode =
                this.formItem.parentCode + ":" + this.formItem.menuUrl;
            }
            updateMenuData(this.formItem)
              .then(res => {
                if (res.data.isSuccess) {
                  this.$Message.info("修改成功");
                  this.newModal = false;
                  this.startToGetMenuList();
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
        id: undefined,
        name: "",
        menuDesc: "",
        menuIcon: "",
        menuCode: "",
        parentCode: "",
        menuUrl: "",
        parentId: 0,
        sort: "",
        level: 1
      };
      this.newModal = false;
    },

    setPageSize(pageSize) {
      this.pageSize = pageSize;
      console.log(pageSize);
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
      getMenuData(data)
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
    startToGetMenuList() {
      this.loading = true;
      let data = {
        pageNo: this.pageNo,
        pageSize: this.pageSize
      };
      getMenuData(data)
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
    this.startToGetMenuList();
  }
};
</script>

<style scoped>
.colClass {
  text-align: center;
}

</style>
