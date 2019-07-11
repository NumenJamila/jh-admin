<template>
  <div>
    <Card>
      <Form :model="formItem" :label-width="80">
        <Row>
          <Col span="6">
            <FormItem label="产业名称：">
              <Input
                clearable
                placeholder="输入产业名称"
                class="search-input"
                v-model="searchValue.domainName"
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
        <Icon type="search" />新增产业
      </Button>
      <Modal v-model="newModal" :title="modalTitle">
        <Form :model="formItem" ref="formValidate" :label-width="80" :rules="rules">
          <FormItem label="产业名称" prop="domainName">
            <Input v-model="formItem.domainName" placeholder="Enter something..."></Input>
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
import { domainList, domainSave, domainDelete, domainUpdateDomain } from "@/api/data";
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
        domainName: ""
      },
      formItem: {
        domainNo: 0,
        domainName: ""
      },

      rules: {
        domainName: [
          { required: true, validator: isNotEmpty, trigger: "blur" },
          { min: 2, message: "产业名称不可少于2个字符", trigger: "blur" },
          { max: 20, message: "产业名称不可超过20个字符", trigger: "blur" }
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
          title: "产业名称",
          key: "domainName",
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
                      this.editBus(params.row.domainNo, params.row.domainName);
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
                      this.DeleteDomain(params.row.id);
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
    // 唤起新增用户对话框
    newModalFunc() {
      this.modalTitle = "新增产业";
      this.formItem = {
        domainNo: 0,
        domainName: ""
      };
      this.newModal = true;
    },
    // 唤起修改对话框
    editBus(domainNo, domainName) {
      this.modalTitle = "修改产业";
      this.formItem = {
        domainNo: domainNo,
        domainName: domainName
      };
      this.newModal = true;
    },
    // 删除产业
    DeleteDomain(id) {
      domainDelete(id)
        .then(res => {
          this.loading = false;
          if (res.data.isSuccess) {
            this.$Message.info("已删除产业");
            this.DomainList();
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
    // 新建修改产业
    modalOk() {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          if (this.formItem.domainNo == 0) {
            domainSave(this.formItem)
              .then(res => {
                if (res.data.isSuccess) {
                  this.$Message.info("添加成功");
                  this.newModal = false;
                  this.DomainList();
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
                  this.DomainList();
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
        domainNo: 0,
        domainName: ""
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
      domainList(data)
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
      this.DomainList();
    },
    // 换页
    changePage(pageNo) {
      this.pageNo = pageNo;
      this.DomainList();
    },
    DomainList() {
      this.loading = true;
      let data = {
        pageNo: this.pageNo,
        pageSize: this.pageSize
      };
      domainList(data)
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
    this.DomainList();
  }
};
</script>

<style scoped>
.colClass {
  text-align: center;
}
</style>
