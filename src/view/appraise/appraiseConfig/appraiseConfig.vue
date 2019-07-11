<template>
  <div>
    <Card>
      <Form :model="formItem" :label-width="80">
        <Row>
          <Col span="6">
            <FormItem label="类别名称：">
              <Input
                clearable
                placeholder="输入评价类别名称"
                class="search-input"
                v-model="searchValue.appraiseUs"
              />
            </FormItem>
          </Col>
          <Col span="6">
            <Button
              @click="handleSearch"
              class="search-btn"
              style="margin-left: 10px;"
              type="primary"
            >
              <Icon type="search" />搜索
            </Button>
          </Col>
        </Row>
      </Form>
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
        <Icon type="search" />新增评价类别
      </Button>
      <Modal v-model="newModal" :title="modalTitle">
        <Form :model="formItem" ref="formValidate" :label-width="100" :rules="rules">
          <FormItem label="评价类别名称" prop="appraiseName">
            <Input v-model="formItem.appraiseName" placeholder="Enter something..."></Input>
          </FormItem>
          <FormItem label="类别英文" prop="appraiseUs">
            <Input v-model="formItem.appraiseUs" placeholder="Enter something..."></Input>
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
import { appraiseList, appraiseDelete, appraiseSave } from "@/api/data";
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
      searchValue: {
        appraiseName: ""
      },
      formItem: {
        appraiseNo: 0,
        appraiseName: "",
        appraiseUs: ""
      },

      rules: {
        appraiseName: [
          { required: true, validator: isNotEmpty, trigger: "blur" },
          { min: 2, message: "评价类别名称不可少于2个字符", trigger: "blur" },
          { max: 20, message: "评价类别名称不可超过20个字符", trigger: "blur" }
        ],
        appraiseUs: [
          { required: true, validator: isNotEmpty, trigger: "blur" },
          { min: 2, message: "评价类别名称不可少于2个字符", trigger: "blur" },
          { max: 20, message: "评价类别名称不可超过20个字符", trigger: "blur" }
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
          title: "类别名称",
          key: "appraiseName",
          align: "center"
        },
        {
          title: "类别英文",
          key: "appraiseUs",
          align: "center"
        },
        {
          title: "占比",
          key: "percent",
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
                    size: "small",
                    icon: 'md-create'
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
                      this.editBus(params.row.appraiseNo, params.row.appraiseName, params.row.appraiseUs);
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
                      this.AppraiseDelete(params.row.id);
                    }
                  }
                },
                [
                  h(
                    "Button",
                    {
                      props: {
                        type: "error",
                        size: "small",
                        icon: 'ios-trash'
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
    // 唤起新增评价类别对话框
    newModalFunc() {
      this.modalTitle = "新增评价类别";
      this.formItem = {
        appraiseNo: 0,
        appraiseName: "",
        appraiseUs: ""
      };
      this.newModal = true;
    },
    // 唤起修改对话框
    editBus(appraiseNo, appraiseName, appraiseUs) {
      this.modalTitle = "修改评价类别";
      this.formItem = {
        appraiseNo: appraiseNo,
        appraiseName: appraiseName,
        appraiseUs: appraiseUs
      };
      this.newModal = true;
    },
    // 删除评价类别
    AppraiseDelete(id) {
      appraiseDelete(id)
        .then(res => {
          this.loading = false;
          if (res.data.isSuccess) {
            this.$Message.info("已删除评价类别");
            this.AppraiseList();
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
    // 新建修改评价类别
    modalOk() {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          if (this.formItem.appraiseNo == 0) {
            appraiseSave(this.formItem)
              .then(res => {
                if (res.data.isSuccess) {
                  this.$Message.info("添加成功");
                  this.newModal = false;
                  this.AppraiseList();
                } else {
                  this.$Message.error("请求失败:" + res.data.msg);
                }
              })
              .catch(res => {
                this.$Message.error("网络异常");
              });
          } else {
            domainUpdateDomain(this.formItem)
              .then(res => {
                if (res.data.isSuccess) {
                  this.$Message.info("修改成功");
                  this.newModal = false;
                  this.AppraiseList();
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
        appraiseNo: 0,
        appraiseName: "",
        appraiseUs: ""
      };
      this.newModal = false;
      this.$Message.info("已取消");
    },
    handleSearch() {
      let data = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        domainName: this.searchValue.domainName
      };
      appraiseList(data)
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
    setPageSize(pageSize) {
      this.pageSize = pageSize;
      this.AppraiseList();
    },
    // 换页
    changePage(pageNo) {
      this.pageNo = pageNo;
      this.AppraiseList();
    },
    AppraiseList() {
      this.loading = true;
      let data = {
        pageNo: this.pageNo,
        pageSize: this.pageSize
      };
      appraiseList(data)
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
    this.AppraiseList();
  }
};
</script>

<style scoped>
.colClass {
  text-align: center;
}
</style>
