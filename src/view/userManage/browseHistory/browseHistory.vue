<template>
  <div>
    <Card>
      <Form :label-width="80">
        <Row>
          <Col span="6">
            <FormItem label="员工号：">
              <Input clearable placeholder="输入员工号" class="search-input" v-model="userNo" />
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="对象类型：">
              <Select v-model="browseType">
                <Option
                  v-for="item in typeList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
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
    </Card>
  </div>
</template>

<script>
import Tables from "_c/tables";
import { browseHistoryList } from "@/api/data";
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters({
      jurisdiction: "jurisdiction"
    })
  },
  name: "enterpriseEvaluation",
  components: {
    Tables
  },
  data() {
    return {
      typeList: [
        {
          value: 0,
          label: "不限条件"
        },
        {
          value: 1,
          label: "公司"
        },
        {
          value: 2,
          label: "咨询报告"
        },
        {
          value: 3,
          label: "政策文件"
        }
      ],
      browseType: 0,
      userNo: "",
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
          title: "用户姓名",
          key: "userName",
          align: "center",
          width: 100
        },
        {
          title: "员工号",
          key: "userNo",
          align: "center",
          width: 100
        },
        { title: "浏览对象", key: "browse", align: "center" },
        {
          title: "对象类型",
          key: "browseType",
          align: "center"
        }
      ],
      tableData: []
    };
  },
  methods: {
    setPageSize(pageSize) {
      this.pageSize = pageSize;
      this.BrowseHistoryList();
    },
    // 换页
    changePage(pageNo) {
      this.pageNo = pageNo;
      this.BrowseHistoryList();
    },
    BrowseHistoryList() {
      this.loading = true;
      let data = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        userNo: "",
        browseType: 0
      };
      browseHistoryList(data)
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
    handleSearch() {
      this.loading = true;
      let data = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        userNo: this.userNo,
        browseType: this.browseType
      };
      browseHistoryList(data)
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
    this.BrowseHistoryList();
  }
};
</script>

<style scoped>
.colClass {
  text-align: center;
}
</style>
