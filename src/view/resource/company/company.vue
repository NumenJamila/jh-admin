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
            <FormItem label="企业名称" prop="companyName">
              <Input v-model="formItem.companyName" placeholder="Enter something..."></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="法人代表" prop="legalRepresentative">
              <Input v-model="formItem.legalRepresentative" placeholder="Enter something..."></Input>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="企业网站" prop="website">
              <Input v-model="formItem.website" placeholder="Enter something..."></Input>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="企业简介" prop="companyDesc">
              <Input v-model="formItem.companyDesc" type="textarea" :rows="3" placeholder="Enter something..."></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="注册资本" prop="capitalType">
              <Input v-model="formItem.regCapital" placeholder="Enter something..."></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="资本类型" prop="capitalType">
              <Select v-model="formItem.capitalType">
                <Option
                  v-for="item in capitalTypeList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="经营状态" prop="manageStatus">
              <Input v-model="formItem.manageStatus" placeholder="Enter something..."></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="融资情况" prop="finanSituation">
              <Select v-model="formItem.finanSituation">
                <Option
                  v-for="item in finanSituationList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="统一社会信用代码" prop="socialCreditCode">
              <Input v-model="formItem.socialCreditCode" placeholder="Enter something..."></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="组织机构代码" prop="orgCode">
              <Input v-model="formItem.orgCode" placeholder="Enter something..."></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="联系电话" prop="contactPhone">
              <Input v-model="formItem.contactPhone" placeholder="Enter something..."></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="联系邮箱" prop="companyEmail">
              <Input v-model="formItem.companyEmail" placeholder="Enter something..."></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="公司类型" prop="companyType">
              <Input v-model="formItem.companyType" placeholder="Enter something..."></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="行业" prop="industry">
              <Input v-model="formItem.industry" placeholder="Enter something..."></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="重要焦点" prop="importantFocus">
              <Input v-model="formItem.importantFocus" placeholder="Enter something..."></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="企业标签">
              <Tag
                v-for="item in tagList"
                :key="item"
                :name="item"
                closable
                @on-close="handleClose2"
              >{{ item }}</Tag>
              <!-- <Button icon="ios-add" type="dashed" size="small" @click="handleAdd">添加标签</Button> -->
              <Input v-model="tagTemp" placeholder="回车确定" class="TagInput" @on-enter="handleAdd"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="注册时间" prop="startTerm">
              <DatePicker type="date" @on-change="startTermFunc" placeholder="Select date"></DatePicker>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="营业期限" prop="endTerm">
              <DatePicker type="date" @on-change="endTermFunc" placeholder="Select date"></DatePicker>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="人员规模" prop="companyPeopleNum">
              <Input v-model="formItem.companyPeopleNum" type="number" placeholder="Enter something..."></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="核准日期" prop="approvalDate">
              <DatePicker type="datetime" @on-change="approvalDateFunc" placeholder="Select date"></DatePicker>
            </FormItem>
          </Col>
          <!-- <Col span="12">
            <FormItem label="注册地址" prop="regAddress">
              <v-distpicker :province="formItem.province" :city="formItem.city" :area="formItem.district" @selected="regAddressFunc"></v-distpicker>
            </FormItem>
          </Col> -->
          <Col span="24">
            <FormItem label="详细地址" prop="addressDetail">
              <v-distpicker class="inline-block" :province="formItem.province" :city="formItem.city" :area="formItem.district" @selected="addressDetailFunc"></v-distpicker>
              <Input class="inline-block width200" v-model="formItem.addressDetail" placeholder="Enter something..."></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="经营范围" prop="businessScope">
              <Input v-model="formItem.businessScope" type="textarea" :rows="3" placeholder="Enter something..."></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="logo" prop="companyLogo">
                <div class="demo-upload-list" v-if="formItem.companyLogo">
                  <img :src="formItem.companyLogo" />
                  <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView()"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleRemove()"></Icon>
                  </div>
                </div>
              <Upload
                ref="upload"
                :show-upload-list="false"
                :on-success="handleSuccess"
                :format="['jpg','jpeg','png']"
                :max-size="2048"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                type="drag"
                :action="uploadUrl"
                style="display: inline-block;width:58px;"
              >
                <div style="width: 58px;height:58px;line-height: 58px;">
                  <Icon type="ios-camera" size="20"></Icon>
                </div>
              </Upload>
              <Modal title="图片预览" v-model="visible">
                <img :src="formItem.companyLogo" v-if="visible" style="width: 100%" />
              </Modal>
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
              <td width="144px">企业网站</td>
              <td colspan="3">
                <span class>{{companyInfo.website}}</span>
              </td>
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
  companyinfoUpdate,
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
      uploadUrl: "",
      capitalTypeList: [
        {
          value: "0",
          label: "人民币"
        },
        {
          value: "1",
          label: "美元"
        }
      ],
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
      tagList: [],
      tagTemp: "",
      finanSituationVal: "",
      logoObj: {},
      imgName: "",
      visible: false,
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
        regCapital: "",
        startTerm: "",
        tagName: ""
      },
      formItem: {
        companyNo: 0,
        companyLogo: "",
        // regAddress: "",
        companyName: "",
        finanSituation: "",
        legalRepresentative: "",
        provinceCode: "",
        // addressDetail: "", // '详细地址',
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
        website: "", // '公司网站',
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
        companyLogo: [
          { required: true, validator: isNotEmpty, trigger: "blur" }
        ],
        // regAddress: [
        //   { required: true, validator: isNotEmpty, trigger: "blur" }
        // ],
        companyName: [
          { required: true, validator: isNotEmpty, trigger: "blur" }
        ],
        companyType: [
          { required: true, validator: isNotEmpty, trigger: "blur" }
        ],
        finanSituation: [
          { required: true, validator: isNotEmpty, trigger: "blur" }
        ],
        industry: [
          { required: true, validator: isNotEmpty, trigger: "blur" }
        ],
        legalRepresentative: [
          { required: true, validator: isNotEmpty, trigger: "blur" }
        ],
        addressDetail: [
          { required: true, validator: isNotEmpty, trigger: "blur" }
        ],
        orgCode: [
          { required: true, validator: isNotEmpty, trigger: "blur" }
        ],
        socialCreditCode: [
          { required: true, validator: isNotEmpty, trigger: "blur" }
        ],
        regCapital: [
          { required: true, validator: isNotEmpty, trigger: "blur" }
        ],
        capitalType: [
          { required: true, validator: isNotEmpty, trigger: "blur" }
        ],
        approvalDate: [
          { required: true, validator: isNotEmpty, trigger: "blur" }
        ],
        contactPhone: [
          { required: true, validator: isNotEmpty, trigger: "blur" }
        ],
        website: [
          { required: true, validator: isNotEmpty, trigger: "blur" }
        ],
        businessScope: [
          { required: true, validator: isNotEmpty, trigger: "blur" }
        ],
        companyType: [
          { required: true, validator: isNotEmpty, trigger: "blur" }
        ],
        endTerm: [
          { required: true, validator: isNotEmpty, trigger: "blur" }
        ],
        startTerm: [
          { required: true, validator: isNotEmpty, trigger: "blur" }
        ],
        manageStatus: [
          { required: true, validator: isNotEmpty, trigger: "blur" }
        ],
        FinanSituation: [
          { required: true, validator: isNotEmpty, trigger: "blur" }
        ],
        tagName: [
          { required: true, validator: isNotEmpty, trigger: "blur" }
        ], 
        companyDesc: [
          { required: true, validator: isNotEmpty, trigger: "blur" }
        ],
        companyEmail: [
          { required: true, validator: isNotEmpty, trigger: "blur" }
        ],
        companyPeopleNum: [
          { required: true, validator: isNotEmpty, trigger: "blur" }
        ],
        importantFocus: [
          { required: true, validator: isNotEmpty, trigger: "blur" }
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
    changeStr() {

    },
    startTermFunc(e) {
      console.log("成立", e)
      this.formItem.startTerm = e
    },
    endTermFunc(e) {
      console.log("end", e)
      this.formItem.endTerm = e
    },
    approvalDateFunc(e) {
      console.log("appr", e)
      this.formItem.approvalDate = e
    },
    // regAddressFunc(e) {
    //   console.log("reg", e)
    // },
    addressDetailFunc(e) {
      console.log("det", e)
      this.formItem.province = e.province.value
      this.formItem.provinceCode = e.province.code
      this.formItem.city = e.city.value
      this.formItem.cityCode = e.city.code
      this.formItem.district = e.area.value
      this.formItem.districtCode = e.area.code
    },
    handleAdd() {
      // if (this.tagList.length) {
      //     this.tagList.push(this.tagList[this.tagList.length - 1] + 1);
      // } else {
      //     this.count.push(0);
      // }
      if (this.tagTemp) {
        this.tagList.push(this.tagTemp);
        this.tagTemp = "";
        if(!this.tagList.length==0) {
        this.fromItem.tagName = this.tagList.join(",")
      }
      }
    },
    handleClose2(event, name) {
      const index = this.tagList.indexOf(name);
      this.tagList.splice(index, 1);
    },
    handleView() {
      this.visible = true;
    },
    handleRemove() {
      // const fileList = this.$refs.upload.fileList;
      // this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
      this.formItem.companyLogo = ""
    },
    handleSuccess(res, file) {
      // file.url =
      //   "https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar";
      // file.name = "7eb99afb9d5f317c912f08b5212fd69a";
      // console.log(res);
      // console.log(file);
      // 文件上传回调 上传成功后删除待上传文件
      if (res.isSuccess) {
        this.$Message.info("上传成功");
        this.loadingStatus = false;
        this.formItem.companyLogo = res.data
      }
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
      this.formItem.companyNo = 0
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
      if(!(this.formItem.province&&this.formItem.city&&this.formItem.district)) {
        this.$Message.error("请选择地址");
        return;
      }
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          if (this.formItem.companyNo == 0) {
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
      // this.formItem = {};
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
    this.uploadUrl = this.$baseApi + "/upload/uploadLogo";
    this.CompanyinfoList();
  }
};
</script>
<style lang="less" scoped>
.colClass {
  text-align: center;
}
.inline-block {
  display: inline-block !important;
}
.width200 {
  margin-left: 16px;
  width: 200px;
  vertical-align: top;
}
.TagInput {
  display: inline-block !important;
  width: 100px;
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
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>
<style>
.distpicker-address-wrapper select {
  padding: 4px 7px !important;
  line-height: 1.5 !important;
  height: 32px !important;
  font-size: 12px;
}
</style>

