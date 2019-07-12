<template>
  <div>
    <Card>
      <Form :model="searchValue" :label-width="80">
        <Row>
          <Col span="6">
            <FormItem label="员工号：">
              <Input
                clearable
                placeholder="输入员工号"
                class="search-input"
                v-model="searchValue.employeeNo"
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
import { portalUserList } from "@/api/data";
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
      searchValue: {
        employeeNo: ""
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
          title: "用户姓名",
          key: "userName",
          align: "center",
          width: 100
        },
        {
          title: "员工号",
          key: "employeeNo",
          align: "center",
          width: 100
        },
        { title: "所属", key: "domainName", align: "center" },
        {
          title: "手机号",
          key: "mobile",
          align: "center"
        },
        { title: "邮箱", key: "email", align: "center" },
        { title: "创建时间", key: "crTime", align: "center", sortable: true },
        {
          title: "最后登录时间",
          key: "updateTime",
          align: "center",
          sortable: true
        }
      ],
      tableData: []
    };
  },
  methods: {
    setPageSize(pageSize) {
      this.pageSize = pageSize;
      this.PortalUserList();
    },
    // 换页
    changePage(pageNo) {
      this.pageNo = pageNo;
      this.PortalUserList();
    },
    PortalUserList() {
      this.loading = true;
      let data = {
        pageNo: this.pageNo,
        pageSize: this.pageSize
      };
      portalUserList(data)
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
    this.PortalUserList();
  }
};
</script>

<style scoped>
.colClass {
  text-align: center;
}
</style>
