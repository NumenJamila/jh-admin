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
      <Modal v-model="editPercentModal" width="960" style="overflow: hidden">
        <p slot="header">
          <span>修改占比</span>
          <span class="head-wrapper">
            <span>占比总和:</span>
            <span>{{total}}%</span>
          </span>
        </p>
        <Form ref="formPercent" :label-width="80" style="overflow: hidden;padding-top:30px;">
          <div v-for="(sliderItem,index) in formPercent" :key="index">
            <Col span="8">
              <FormItem :label="sliderItem.appraiseName">
                <Slider v-model="sliderItem.percent" show-input @on-input="sliderInput"></Slider>
              </FormItem>
            </Col>
          </div>
        </Form>
        <div slot="footer">
          <div class="footer-wrapper">
            <Button type="primary" size="large" @click="toSet(1)">等分比例</Button>
            <Button type="primary" size="large" @click="toSet(0)">随机比例</Button>
          </div>
          <Button type="text" size="large" @click="percentCancel">取消</Button>
          <Button type="primary" size="large" @click="percentOk">确定</Button>
        </div>
      </Modal>
    </Card>
  </div>
</template>

<script>
import Tables from "_c/tables";
import {
  appraiseList,
  appraiseDelete,
  appraiseSave,
  appraiseGetAppraiseList,
  appraiseUpdatePercent
} from "@/api/data";
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
      itemLength: 0,
      total: 0,
      editPercentModal: false,
      formPercent: [],
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
                      this.editBus(
                        params.row.appraiseNo,
                        params.row.appraiseName,
                        params.row.appraiseUs
                      );
                    }
                  }
                },
                "修改"
              ),
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
                      this.editPercent();
                    }
                  }
                },
                "修改占比"
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
    //修改占比
    editPercent() {
      let that = this;
      that.total = 0
      appraiseGetAppraiseList().then(res => {
        if (res.data.isSuccess) {
          that.formPercent = res.data.data;
          for (var value of res.data.data) {
            that.total += value.percent;
          }
          that.itemLength = res.data.data.length;
          that.editPercentModal = true;
        } else {
          this.$Message.error("请求失败:" + res.data.msg);
        }
      });
    },
    // 计算total占比
    sliderInput() {
      let that = this;
      let tempCount = 0;
      for (var value of that.formPercent) {
        tempCount += value.percent;
      }
      that.total = tempCount;
    },
    toSet(e) {
      let that = this;
      if (e === 1) {
        let base = Math.floor(100 / that.itemLength);
        console.log(base);
        let rest = 100 % that.itemLength;
        console.log(rest);
        for (let i = 0; i < that.itemLength; i++) {
          that.formPercent[i].percent = base + (i < rest ? 1 : 0);
        }
      } else if (e === 0) {
        let restPercentArr = that.randAlloc(100, 5, 80, that.itemLength);
        for (let i = 0; i < that.itemLength; i++) {
          that.formPercent[i].percent = restPercentArr[i];
        }
      } else {
        console.log("无此分配比例");
      }
      // that.sliderInput()
    },
    // 随机函数
    randAlloc(total, min, max, length) {
      // 首先要判断是否符合 min 和 max 条件
      if (min * length > total || max * length < total) {
        throw Error(`没法满足最最少 ${min} 最大 ${max} 的条件`);
      }

      const result = [];
      let restValue = total;
      let restLength = length;
      for (let i = 0; i < length - 1; i++) {
        restLength--;
        // 这一次要发的数量必须保证剩下的要足最小量
        // 同进要保证剩下的不能大于需要的最大量
        const restMin = restLength * min;
        const restMax = restLength * max;
        // 可发的量
        const usable = restValue - restMin;
        // 最少要发的量
        const minValue = Math.max(min, restValue - restMax);
        // 以 minValue 为最左，max 为中线来进行随机，即随机范围是 (max - minValue) * 2
        // 如果这个范围大于 usable - minValue，取 usable - minValue
        const limit = Math.min(usable - minValue, (max - minValue) * 2);
        // 随机部分加上最少要发的部分就是应该发的，但是如果大于 max，最大取到 max
        result[i] = Math.min(max, minValue + Math.floor(limit * Math.random()));
        restValue -= result[i];
      }
      result[length - 1] = restValue;

      return result;
    },

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

    // 确定修改占比
    percentOk() {
      let that = this
      if (that.total===100) {
        appraiseUpdatePercent(this.formPercent)
          .then(res => {
            if (res.data.isSuccess) {
              this.$Message.info("修改成功");
              this.editPercentModal = false;
              this.AppraiseList();
            } else {
              this.$Message.error("请求失败:" + res.data.msg);
            }
          })
          .catch(res => {
            this.$Message.error("网络异常");
          });
      } else {
        that.$Message.error("请确认占比总和为100");
      }
    },
    percentCancel() {
      let that = this
      that.editPercentModal = false
      that.total = 0
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
.head-wrapper {
  float: right;
  margin-right: 50px;
}
.footer-wrapper {
  float: left;
}
.ivu-input-number {
  width: 40px;
}
.ivu-slider-input .ivu-slider-wrap {
    margin-right: 60px;
}
</style>
