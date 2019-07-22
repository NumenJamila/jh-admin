<template>
  <div>
    <Card>
      <Form :model="searchValue" :label-width="100">
        <Row>
          <Col span="6">
            <FormItem label="合作信息名称：">
              <Input
                clearable
                placeholder="输入合作信息名称"
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
        <Icon type="search" />新增合作信息
      </Button>
      <Modal v-model="newModal" :title="modalTitle">
        <Form :model="formItem" ref="formValidate" :label-width="100" :rules="rules">
          <FormItem label="合作内容" prop="cooperateContext">
            <Input v-model="formItem.cooperateContext" placeholder="Enter something..."></Input>
          </FormItem>
          <FormItem label="合作日期" prop="cooperateDate">
            <Date-picker
              placeholder="选择日期"
              type="datetime"
              :value="formItem.cooperateDate"
              :key="formItem.cooperateDate"
              format="yyyy-MM-dd"
              @on-change="formItem.cooperateDate=$event"
            ></Date-picker>
          </FormItem>
          <FormItem label="合作背景" prop="background">
            <Input
              v-model="formItem.background"
              type="textarea"
              :rows="3"
              placeholder="Enter something..."
            ></Input>
          </FormItem>
          <FormItem label="甲方名称" prop="firstPartyName">
            <Input v-model="formItem.firstPartyName" placeholder="Enter something..."></Input>
          </FormItem>
          <FormItem label="甲方手机" prop="fpMobile">
            <Input v-model="formItem.fpMobile" placeholder="Enter something..."></Input>
          </FormItem>
          <FormItem label="甲方邮箱" prop="fpEmail">
            <Input v-model="formItem.fpEmail" placeholder="Enter something..."></Input>
          </FormItem>
          <FormItem label="甲方办公电话" prop="fpOfficePhone">
            <Input v-model="formItem.fpOfficePhone" placeholder="Enter something..."></Input>
          </FormItem>
          <FormItem label="乙方名称" prop="secondPartyName">
            <Input v-model="formItem.secondPartyName" placeholder="Enter something..."></Input>
          </FormItem>
          <FormItem label="乙方手机" prop="spMoblie">
            <Input v-model="formItem.spMoblie" placeholder="Enter something..."></Input>
          </FormItem>
          <FormItem label="乙方邮箱" prop="spEmail">
            <Input v-model="formItem.spEmail" placeholder="Enter something..."></Input>
          </FormItem>
          <FormItem label="乙方办公电话" prop="spOfficePhone">
            <Input v-model="formItem.spOfficePhone" placeholder="Enter something..."></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="text" size="large" @click="modalCancel">取消</Button>
          <Button type="primary" size="large" @click="next">下一步</Button>
        </div>
      </Modal>
      <Modal v-model="flowModal" title="合作流程" width="1200px" class="clearfix">
        <div>
          <Button type="primary" icon="md-add" style="margin-right: 20px;" @click="add"></Button>

          <Button type="primary" icon="ios-trash" @click="deleteItem"></Button>

          <Row v-for="(item,index) in formItem.cooperFlow" :key="index" class="Row-class">
            <!--Del-->
            <!-- `checked` 为 true 或 false -->
            <Checkbox v-model="item.isDelete" size="small" class="check-class"></Checkbox>
            <!--Parameter-->
            <Col :span="4">
              <label :for="item.date">日期：</label>
              <Date-picker
                style="width: 80%"
                placeholder="选择日期"
                type="datetime"
                :value="item.date"
                :key="item.date"
                format="yyyy-MM-dd HH:mm"
                @on-change="item.date=$event"
              ></Date-picker>
            </Col>
            <Col :span="4">
              <label :for="item.flow">事件：</label>
              <Input placeholder="请输入内容" style="width: 70%" v-model="item.flow" clearable></Input>
            </Col>
            <Col :span="4">
              <label :for="item.department">部门：</label>
              <Input placeholder="请输入内容" style="width: 70%" v-model="item.department" clearable></Input>
            </Col>
            <Col :span="4">
              <label :for="item.operator">操作员：</label>
              <Input placeholder="请输入内容" style="width: 70%" v-model="item.operator" clearable></Input>
            </Col>
            <Col :span="4">
              <label :for="item.phone">电话：</label>
              <Input placeholder="请输入内容" style="width: 70%" v-model="item.phone" clearable></Input>
            </Col>
            <Col :span="4">
              <label :for="item.email">邮箱：</label>
              <Input placeholder="请输入内容" style="width: 70%" v-model="item.email" clearable></Input>
            </Col>
          </Row>
        </div>
        <div slot="footer">
          <Button type="text" size="large" @click="back">返回</Button>
          <Button type="primary" size="large" @click="modalOk">确定</Button>
        </div>
      </Modal>
    </Card>
  </div>
</template>

<script>
import Tables from "_c/tables";
import {
  cooperateDelete,
  cooperateList,
  cooperateSave,
  cooperateUpdate
} from "@/api/data";
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters({
      jurisdiction: "jurisdiction"
    })
  },
  name: "cooperate",
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
      flowModal: false,
      newModal: false,
      modalTitle: "",
      userId: 0,
      showPassword: false,
      searchValue: {
        domainName: ""
      },
      formItem: {
        id: 0,
        cooperFlow: []
      },

      rules: {
        domainName: [{ required: true, validator: isNotEmpty, trigger: "blur" }]
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
          fixed: "left",
          width: 60
        },
        {
          title: "合作内容",
          key: "cooperateContext",
          align: "center",
          width: 150
        },
        {
          title: "合作日期",
          key: "cooperateDate",
          align: "center",
          width: 120
        },
        {
          title: "合作背景",
          key: "background",
          align: "center",
          width: 120,
          ellipsis: true,
          render: (h, params) => {
            let texts = ""; //表格列显示文字
            if (params.row.background !== null) {
              if (params.row.background.length > 10) {
                //进行截取列显示字数
                texts = params.row.background.substring(0, 10) + ".....";
              } else {
                texts = params.row.background;
              }
            }
            return h(
              "Tooltip",
              {
                props: { placement: "top", transfer: true }
              },
              [
                texts,
                h(
                  "span",
                  {
                    slot: "content",
                    style: { whiteSpace: "normal", wordBreak: "break-all" }
                  },
                  params.row.background
                )
              ]
            );
          }
        },
        {
          title: "甲方名称",
          key: "firstPartyName",
          align: "center",
          width: 120
        },
        {
          title: "甲方手机",
          key: "fpMobile",
          align: "center",
          width: 120
        },
        {
          title: "甲方邮箱",
          key: "fpEmail",
          align: "center",
          width: 120
        },
        {
          title: "甲方办公电话",
          key: "fpOfficePhone",
          align: "center",
          width: 120
        },
        {
          title: "乙方名称",
          key: "secondPartyName",
          align: "center",
          width: 120
        },
        {
          title: "乙方手机",
          key: "spMoblie",
          align: "center",
          width: 120
        },
        {
          title: "乙方邮箱",
          key: "spEmail",
          align: "center",
          width: 120
        },
        {
          title: "乙方办公电话",
          key: "spOfficePhone",
          align: "center",
          width: 120
        },
        {
          title: "操作",
          align: "center",
          key: "action",
          width: 160,
          render: (h, params) => {
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
                    display: !this.jurisdiction[
                      "systemManagement:userManagement:add"
                    ]
                      ? "none"
                      : "inline-block"
                  },
                  on: {
                    click: () => {
                      this.editBus(params.row);
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
                      this.CooperateDelete(params.row.id);
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
                        icon: "ios-trash"
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
    add() {
      this.formItem.cooperFlow.push({
        flow: "",
        date: "",
        department: "",
        operator: "",
        phone: "",
        email: "",
        isDelete: false
      });
    },
    deleteItem() {
      /*遍历数组，然后根据选中的状态获取对应的下标，然后进行删除*/
      for (let i = 0; i < this.formItem.cooperFlow.length; i++) {
        let obj = this.formItem.cooperFlow[i];
        if (obj.isDelete) {
          this.formItem.cooperFlow.splice(i, 1);
          i--;
        }
      }
    },
    next() {
      this.newModal = false;
      this.flowModal = true;
    },
    back() {
      this.newModal = true;
      this.flowModal = false;
    },
    // 唤起新增用户对话框
    newModalFunc() {
      this.modalTitle = "新增合作信息";
      this.formItem = {};
      this.formItem.cooperFlow = [];
      this.formItem.id = 0;
      this.newModal = true;
    },
    // 唤起修改对话框
    editBus(domainNo, domainName) {
      this.modalTitle = "修改合作信息";
      this.formItem = {
        domainNo: domainNo,
        domainName: domainName
      };
      this.newModal = true;
    },
    // 删除合作信息
    CooperateDelete(id) {
      cooperateDelete(id)
        .then(res => {
          this.loading = false;
          if (res.data.isSuccess) {
            this.$Message.info("已删除合作信息");
            this.CooperateList();
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
    // 新建修改合作信息
    modalOk() {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          if (this.formItem.id == 0) {
            cooperateSave(this.formItem)
              .then(res => {
                if (res.data.isSuccess) {
                  this.$Message.info("添加成功");
                  this.newModal = false;
                  this.CooperateList();
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
                  this.CooperateList();
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
      cooperateList(data)
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
      this.CooperateList();
    },
    // 换页
    changePage(pageNo) {
      this.pageNo = pageNo;
      this.CooperateList();
    },
    CooperateList() {
      this.loading = true;
      let data = {
        pageNo: this.pageNo,
        pageSize: this.pageSize
      };
      cooperateList(data)
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
    this.CooperateList();
  }
};
</script>

<style scoped>
.colClass {
  text-align: center;
}
.Row-class {
position: relative;
margin-top: 20px;
}
.check-class {
 position: absolute;
 right: -2px;
 top: 6px;
}
</style>
