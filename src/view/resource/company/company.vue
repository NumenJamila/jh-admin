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
      <Modal v-model="newModal" :title="modalTitle" width="980">
        <Form
          :model="formItem"
          ref="formValidate"
          :label-width="80"
          :rules="rules"
          class="clearfix"
        >
          <Col span="12">
            <FormItem label="企业名称" prop="industryName">
              <Input v-model="formItem.industryName" placeholder="Enter something..."></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="地址选择" prop="industryName">
              <v-distpicker province="广东省" city="广州市" area="海珠区"></v-distpicker>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="注册时间" prop="industryName">
              <DatePicker type="date" placeholder="Select date"></DatePicker>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="logo" prop="industryName">
              <div class="demo-upload-list" v-for="item in uploadList">
                <template v-if="item.status === 'finished'">
                  <img :src="item.url" />
                  <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                  </div>
                </template>
                <template v-else>
                  <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                </template>
              </div>
              <Upload
                ref="upload"
                :show-upload-list="false"
                :default-file-list="defaultList"
                :on-success="handleSuccess"
                :format="['jpg','jpeg','png']"
                :max-size="2048"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :before-upload="handleBeforeUpload"
                type="drag"
                action="//jsonplaceholder.typicode.com/posts/"
                style="display: inline-block;width:58px;"
              >
                <div style="width: 58px;height:58px;line-height: 58px;">
                  <Icon type="ios-camera" size="20"></Icon>
                </div>
              </Upload>
              <Modal title="View Image" v-model="visible">
                <img
                  :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'"
                  v-if="visible"
                  style="width: 100%"
                />
              </Modal>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="融资情况" prop="industryName">
              <Select v-model="finanSituationVal">
                <Option
                  v-for="item in finanSituationList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
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
      <Modal v-model="companyEdit" title="企业修改">
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
      <Modal v-model="companyDetail" title="企业详情" width="960">
        <table class="table -striped-col -border-top-none -breakall">
          <tbody>
            <tr>
              <td width="144px">企业名称</td>
              <td width="308px">{{companyInfo.companyName}}</td>
              <td width="150px">法人代表</td>
              <td colspan="2">{{companyInfo.legalRepresentative}}</td>
            </tr>
            <tr>
              <td width="144px">企业简介</td>
              <td colspan="3">
                <span class>{{companyInfo.companyDesc}}</span>
              </td>
            </tr>
            <tr>
              <td width="144px">注册资本</td>
              <td width="308px">
                <div title="1000万人民币">{{companyInfo.regCapital}}</div>
              </td>
              <td width="144px">资本类型</td>
              <td width="308px">
                <div title="1000万人民币">{{companyInfo.capitalType | formatCapitalType}}</div>
              </td>
            </tr>
            <tr>
              <td width="150px">经营状态</td>
              <td width>{{companyInfo.manageStatus}}</td>
              <td width="150px">融资情况</td>
              <td>{{companyInfo.finanSituation}}</td>
            </tr>
            <tr>
              <td width="144px">统一社会信用代码</td>
              <td width="308px">{{companyInfo.socialCreditCode}}</td>
              <td width="150px">组织机构代码</td>
              <td colspan="2">{{companyInfo.orgCode}}</td>
            </tr>
            <tr>
              <td width="144px">联系电话</td>
              <td width="308px">{{companyInfo.contactPhone}}</td>
              <td width="150px">联系邮箱</td>
              <td colspan="2">{{companyInfo.companyEmail}}</td>
            </tr>
            <tr>
              <td width="144px">公司类型</td>
              <td width="308px">{{companyInfo.companyType}}</td>
              <td width="150px">行业</td>
              <td colspan="2">{{companyInfo.industry}}</td>
            </tr>
            <tr>
              <td width="144px">重要焦点</td>
              <td width="308px">{{companyInfo.importantFocus}}</td>
              <td width="150px">标签</td>
              <td colspan="2">{{companyInfo.tagName}}</td>
            </tr>
            <tr>
              <td width="144px">成立日期</td>
              <td width="308px">
                <div title=" ">{{companyInfo.startTerm}}</div>
              </td>
              <td width="144px">营业期限</td>
              <td width="308px">
                <span>{{companyInfo.endTerm}}</span>
              </td>
            </tr>
            <tr>
              <td width="144px">人员规模</td>
              <td width="308px">{{companyInfo.companyPeopleNum}}</td>
              <td width="150px">核准日期</td>
              <td colspan="2">{{companyInfo.approvalDate}}</td>
            </tr>

            <tr>
              <td width="144px">注册地址</td>
              <td colspan="4">{{companyInfo.regAddress}}</td>
            </tr>
            <tr>
              <td width="144px">详细地址</td>
              <td colspan="4">
                <span class>{{companyInfo.addressDetail}}</span>
              </td>
            </tr>
            <tr>
              <td width="144px">经营范围</td>
              <td colspan="4">
                <span class>{{companyInfo.businessScope}}</span>
              </td>
            </tr>
          </tbody>
        </table>
        <div slot="footer">
          <Button type="primary" size="large" @click="companyDetail = false">关闭</Button>
        </div>
      </Modal>
    </Card>
  </div>
</template>

<script>
import Tables from "_c/tables";
import VDistpicker from "v-distpicker";

import {
  companyinfoList,
  companyinfoSave,
  companyinfoDelete,
  companyinfoGetDetail
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
    Tables,
    VDistpicker
  },
  /* 局部过滤器 */
  filters: {
    /* 格式化时间戳 */
    formatCapitalType(val) {
      switch (val) {
        case 0:
          return "人民币";
          break;
        case 1:
          return "美元";
          break;
        default:
          return "-";
      }
    }
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
      finanSituationList: [
        {
          value: "未融资",
          label: "未融资"
        },
        {
          value: "种子轮",
          label: "种子轮"
        },
        {
          value: "天使轮",
          label: "天使轮"
        },
        {
          value: "A轮",
          label: "A轮"
        },
        {
          value: "B轮",
          label: "B轮"
        },
        {
          value: "C轮",
          label: "C轮"
        },
        {
          value: "D轮",
          label: "D轮"
        },
        {
          value: "E轮",
          label: "E轮"
        },
        {
          value: "E轮以上",
          label: "E轮以上"
        }
      ],
      finanSituationVal: "",
      defaultList: [],
      imgName: "",
      visible: false,
      uploadList: [],
      companyEdit: false,
      companyDetail: false,
      searchModal: false,
      newModal: false,
      modalTitle: "",
      userId: 0,
      showPassword: false,
      searchValue: {
        cityCode: "",
        companyName: "",
        companyType: "",
        finanSituation: "",
        importantFocus: "",
        industry: "",
        legalRepresentative: "",
        provinceCode: "",
        regCapital: 0,
        sortCondition: "",
        startTerm: "",
        tagName: ""
      },
      formItem: {
        companyLogo: "",
        regAddress: "",
        cityCode: "",
        companyName: "",
        companyType: "",
        finanSituation: "",
        importantFocus: "",
        industry: "",
        legalRepresentative: "",
        provinceCode: "",
        regCapital: 0,
        sortCondition: "",
        addressDetail: "", // '详细地址',
        province: "", // '省',
        city: "", // '市',
        district: "", // '区',
        provinceCode: "", // '省编码',
        cityCode: "", // '市编码',
        districtCode: "", // '区编码',
        orgCode: "", // '组织机构编码',
        socialCreditCode: "", // '统一社会信用代码',
        regCapital: "", // '注册资本',
        capitalType: "", // '资本类型（0人民币1美元）',
        approvalDate: "", // '核准日期',
        industry: "", // '所属行业',
        contactPhone: "", // '联系电话',
        webSite: "", // '公司网站',
        businessScope: "", // '经营范围',
        companyType: "", // '企业类型(有限责任公司/..) 有限责任公司..',
        endTerm: "", //'经营结束日期',
        startTerm: "", //'注册日期',
        manageStatus: "", // '经营状态',
        FinanSituation: "", // '融资情况 0：未融资，1：种子轮，2：天使轮，A：A轮，B：B轮，C：C轮，D：D轮，E：E轮，EX： E轮以上',
        remark: "",
        tagName: "", //'标签 多标签逗号隔开',
        companyDesc: "",
        companyEmail: "",
        companyPeopleNum: "",
        importantFocus: ""
      },
      companyInfo: {},
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
                      this.seeDetail(params.row.companyNo);
                    }
                  }
                },
                params.row.companyName
              )
            ]);
          }
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
                      this.editBus(params.row.companyNo);
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
                      this.CompanyinfoDelete(params.row.companyNo);
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
    handleView(name) {
      this.imgName = name;
      this.visible = true;
    },
    handleRemove(file) {
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
    },
    handleSuccess(res, file) {
      file.url =
        "https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar";
      file.name = "7eb99afb9d5f317c912f08b5212fd69a";
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "The file format is incorrect",
        desc:
          "File format of " +
          file.name +
          " is incorrect, please select jpg or png."
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "Exceeding file size limit",
        desc: "File  " + file.name + " is too large, no more than 2M."
      });
    },
    handleBeforeUpload() {
      const check = this.uploadList.length < 5;
      if (!check) {
        this.$Notice.warning({
          title: "Up to five pictures can be uploaded."
        });
      }
      return check;
    },
    // 查看详情
    seeDetail(e) {
      companyinfoGetDetail(e)
        .then(res => {
          if (res.data.isSuccess) {
            this.companyInfo = res.data.data;
            this.companyDetail = true;
          } else {
            this.$Message.error("请求失败:" + res.data.msg);
          }
        })
        .catch(err => {
          this.loading = false;
          this.$Message.error("网络异常");
        });
    },
    //唤起高级搜索对话框
    searchModalFunc() {
      this.searchModal = true;
    },
    // 唤起新增用户对话框
    newModalFunc() {
      this.modalTitle = "新增企业";
      this.formItem = {};
      this.newModal = true;
    },
    // 唤起修改对话框
    editBus(companyNo) {
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
      this.pageNo = 1;
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
          this.searchModal = false;
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
<style lang="less" scoped>
.colClass {
  text-align: center;
}
table {
  border-spacing: 0;
  border-collapse: collapse;
}
.table {
  width: 100%;
  max-width: 100%;
  font-size: 14px;
  text-align: center;
  color: #333;
}
.table.-striped-col td:nth-child(odd) {
  background-color: #f0f7fc;
}
.table td {
  padding: 8px;
}
.table td,
.table th {
  border: 1px solid #e4eef6;
  font-weight: 400;
  vertical-align: middle;
}
.distpicker-address-wrapper select {
  padding: 4px 7px;
  line-height: 1.5;
  height: 32px;
}
</style>
