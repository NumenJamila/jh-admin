<template>
  <div>
    <Card>
      <Form :model="searchValue" :label-width="80">
        <Row>
          <Col span="5">
            <FormItem label="企业名称：">
              <Input
                clearable
                placeholder="输入企业名称"
                class="search-input"
                v-model="searchValue.companyName"
              />
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem label="行业门类">
              <Input
                clearable
                placeholder="输入企业名称"
                class="search-input"
                v-model="searchValue.industry"
              />
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem label="法定代表">
              <Input
                clearable
                placeholder="输入法人姓名"
                class="search-input"
                v-model="searchValue.legalRepresentative"
              />
            </FormItem>
          </Col>
          <Col span="2">
            <Button
              @click="handleSearch"
              class="search-btn"
              style="margin-left: 10px;"
              type="primary"
            >
              <Icon type="search" />搜索
            </Button>
          </Col>
          <Col span="2">
            <Button
              @click="searchModalFunc"
              class="search-btn"
              style="margin-left: 10px;"
              type="primary"
            >
              <Icon type="search" />高级搜索
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
        <Icon type="search" />新增企业
      </Button>
      <Modal v-model="newModal" :title="modalTitle">
        <Form :model="formItem" ref="formValidate" :label-width="80" :rules="rules">
          <FormItem label="企业名称" prop="industryName">
            <Input v-model="formItem.industryName" placeholder="Enter something..."></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="text" size="large" @click="modalCancel">取消</Button>
          <Button type="primary" size="large" @click="modalOk">确定</Button>
        </div>
      </Modal>
      <Modal v-model="searchModal" title="高级搜索">
        <Form :model="searchValue" :label-width="80" style="overflow: hidden">
            <Col span="12">
              <FormItem label="企业名称：">
                <Input
                  clearable
                  placeholder="输入企业名称"
                  class="search-input"
                  v-model="searchValue.companyName"
                />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="行业门类：">
                <Input
                  clearable
                  placeholder="输入企业名称"
                  class="search-input"
                  v-model="searchValue.industry"
                />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="法定代表：">
                <Input
                  clearable
                  placeholder="输入法人姓名"
                  class="search-input"
                  v-model="searchValue.legalRepresentative"
                />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="注册日期：">
                <Input
                  clearable
                  placeholder="输入注册日期"
                  class="search-input"
                  v-model="searchValue.startTerm"
                />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="企业标签：">
                <Input
                  clearable
                  placeholder="输入企业标签"
                  class="search-input"
                  v-model="searchValue.tagName"
                />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="融资情况：">
                <Input
                  clearable
                  placeholder="输入融资情况"
                  class="search-input"
                  v-model="searchValue.finanSituation"
                />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="企业类型：">
                <Input
                  clearable
                  placeholder="输入企业类型"
                  class="search-input"
                  v-model="searchValue.companytype"
                />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="省份编码：">
                <Input
                  clearable
                  placeholder="输入省份编码"
                  class="search-input"
                  v-model="searchValue.provinceCode"
                />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="城市编码：">
                <Input
                  clearable
                  placeholder="输入城市编码"
                  class="search-input"
                  v-model="searchValue.cityCode"
                />
              </FormItem>
            </Col>
        </Form>
        <div slot="footer">
          <Button type="text" size="large" @click="searchCancel">取消</Button>
          <Button type="primary" size="large" @click="handleSearch">搜索</Button>
        </div>
      </Modal>
    </Card>
  </div>
</template>

<script>
import Tables from "_c/tables";
import {
  companyinfoList,
  companyinfoSave,
  companyinfoDelete
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
      searchModal: false,
      newModal: false,
      modalTitle: "",
      userId: 0,
      showPassword: false,
      searchValue: {
        companyName: "",
        industry: "",
        legalRepresentative: "",
        startTerm: "",
        tagName: "",
        finanSituation: "",
        companytype: "",
        provinceCode: "",
        cityCode: ""
      },
      formItem: {
        industyNo: 0,
        industryName: ""
      },

      rules: {
        industryName: [
          { required: true, validator: isNotEmpty, trigger: "blur" },
          { min: 2, message: "企业名称不可少于2个字符", trigger: "blur" },
          { max: 20, message: "企业名称不可超过20个字符", trigger: "blur" }
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
          title: "企业名称",
          key: "companyName",
          align: "center"
        },
        {
          title: "企业描述",
          key: "companyDesc",
          align: "center",
          ellipsis: true,
          render: (h, params) => {
            let texts = ""; //表格列显示文字
            if (params.row.companyDesc !== null) {
              if (params.row.companyDesc.length > 10) {
                //进行截取列显示字数
                texts = params.row.companyDesc.substring(0, 10) + ".....";
              } else {
                texts = params.row.companyDesc;
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
                  params.row.companyDesc
                )
              ]
            );
          }
        },
        {
          title: "法定代表人",
          key: "legalRepresentative",
          align: "center"
        },
        {
          title: "企业邮箱",
          key: "companyEmail",
          align: "center"
        },
        {
          title: "联系方式",
          key: "contactPhone",
          align: "center"
        },
        {
          title: "注册资本",
          key: "regCapital",
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
                        params.row.industyNo,
                        params.row.industryName
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
                      this.CompanyinfoDelete(params.row.id);
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
    //唤起高级搜索对话框
    searchModalFunc() {
      this.searchModal = true;
    },
    // 唤起新增用户对话框
    newModalFunc() {
      this.modalTitle = "新增企业";
      this.formItem = {
        industyNo: 0,
        industryName: ""
      };
      this.newModal = true;
    },
    // 唤起修改对话框
    editBus(industyNo, industryName) {
      this.modalTitle = "修改企业";
      this.formItem = {
        industyNo: industyNo,
        industryName: industryName
      };
      this.newModal = true;
    },
    // 删除企业
    CompanyinfoDelete(id) {
      companyinfoDelete(id)
        .then(res => {
          this.loading = false;
          if (res.data.isSuccess) {
            this.$Message.info("已删除企业");
            this.CompanyinfoList();
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
    // 新建修改企业
    modalOk() {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          if (this.formItem.industyNo == 0) {
            companyinfoSave(this.formItem)
              .then(res => {
                if (res.data.isSuccess) {
                  this.$Message.info("添加成功");
                  this.newModal = false;
                  this.CompanyinfoList();
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
                  this.CompanyinfoList();
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
        industyNo: 0,
        industryName: ""
      };
      this.newModal = false;
      this.$Message.info("已取消");
    },
    searchCancel() {
      this.searchValue = {
        companyName: "",
        industry: "",
        legalRepresentative: "",
        startTerm: "",
        tagName: "",
        finanSituation: "",
        companytype: "",
        provinceCode: "",
        cityCode: ""
      };
      this.searchModal = false;
      this.$Message.info("已取消");
    },
    handleSearch() {
      this.pageNo = 1
      let data = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        companyName: this.searchValue.companyName,
        industry: this.searchValue.industry,
        legalRepresentative: this.searchValue.legalRepresentative,
        startTerm: this.searchValue.startTerm,
        tagName: this.searchValue.tagName,
        finanSituation: this.searchValue.finanSituation,
        companytype: this.searchValue.companytype,
        provinceCode: this.searchValue.provinceCode,
        cityCode: this.searchValue.cityCode
      };
      companyinfoList(data)
        .then(res => {
          this.searchModal = false
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
      this.CompanyinfoList();
    },
    // 换页
    changePage(pageNo) {
      this.pageNo = pageNo;
      this.CompanyinfoList();
    },
    CompanyinfoList() {
      this.loading = true;
      let data = {
        pageNo: this.pageNo,
        pageSize: this.pageSize
      };
      companyinfoList(data)
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
    this.CompanyinfoList();
  }
};
</script>

<style scoped>
.colClass {
  text-align: center;
}
</style>
