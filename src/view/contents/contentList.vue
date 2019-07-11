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
        v-if="jurisdiction['systemManagement:permission:add']"
        class="search-btn loc"
        @click="toDetail"
        type="primary"
      >
        <Icon type="search"/>新建内容
      </Button>
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
import {
  addPermissionData,
  deletePermissionData,
  updatePermissionData,
  getPermissionData
} from '@/api/data'
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      jurisdiction: 'jurisdiction'
    })
  },
  name: 'contentList',
  components: {
    Tables
  },
  data () {
    var isNotEmpty = (rule, value, callback) => {
      if (!value || value.replace(/\s*/g, '') === '') {
        return callback(new Error(''))
      } else {
        callback()
      }
    }
    return {
      newModal: false,
      modalTitle: '新建内容',
      modelLoading: true,
      formItem: {
        id: undefined,
        name: '',
        permissionDesc: '',
        permissionCode: ''
      },

      rules: {
        name: [
          { required: true, validator: isNotEmpty, trigger: 'blur' },
          { min: 2, message: '角色中文名称不可少于2个字', trigger: 'blur' },
          { max: 20, message: '角色中文名称不可超过20个字', trigger: 'blur' }
        ],
        permissionDesc: [
          {
            required: true,
            validator: isNotEmpty,
            message: '请输入角色备注',
            trigger: 'blur'
          },
          { max: 200, message: '角色备注不可超过200个字', trigger: 'blur' }
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
          title: '文章标题',
          key: 'name',
          align: 'center'
        },
        { title: '简介', key: 'permissionDesc', align: 'center' },
        { title: '作者', key: 'permissioode', align: 'center' },
        { title: 'PC模式', key: 'permissnCode', align: 'center' },
        { title: '手机模式', key: 'permisionCode', align: 'center' },
        {
          title: '操作',
          align: 'center',
          key: 'action',
          render: (h, params) => {
            return h('div', [
              // h(
              //   'Button',
              //   {
              //     props: {
              //       type: 'primary',
              //       size: 'small'
              //     },
              //     style: {
              //       marginRight: '5px'
              //     },
              //     on: {
              //       click: () => {
              //         this.editBus(
              //           params.row.id,
              //           params.row.name,
              //           params.row.permissionDesc,
              //           params.row.permissionCode,
              //         )
              //       }
              //     }
              //   },
              //   '修改'
              // ),
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small',
                    icon: 'md-create'
                  },
                  style: {
                    marginRight: '5px',
                    display: (!this.jurisdiction['systemManagement:permission:update']) ? 'none' : 'inline-block'
                  },
                  on: {
                    click: () => {
                      this.toDetail(scope.row.id)
                    }
                  }
                },
                '修改'
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
              //         this.detelePermission(params.row.id)
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
                'Poptip',
                {
                  props: {
                    confirm: true,
                    title: '您确定要删除这条数据吗?',
                    transfer: true
                  },
                  on: {
                    'on-ok': () => {
                      this.deteleContent(params.row.id)
                    }
                  }
                },
                [
                  h(
                    'Button',
                    {
                      props: {
                        type: 'primary',
                        size: 'small',
                        icon: 'ios-trash'
                      },
                      style: {
                        display: (!this.jurisdiction['systemManagement:permission:delete']) ? 'none' : 'inline-block'
                      }
                    },
                    '移除'
                  )
                ]
              )
            ])
          }
        }
      ],
      tableData: []
    }
  },
 methods: {
   // 内容
    deteleContent (jobName, jobGroup) {
      let data = {
        time: new Date().toString(),
        jobName: jobName,
        jobGroup: jobGroup
      }
      deteleContentData(data)
        .then(res => {
          this.loading = false
          if (res.data.isSuccess) {
            this.$Message.info('已删除内容')
            this.startToGetContentList()
          } else {
            this.$Message.error('请求失败：' + res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
          this.loading = false
          this.$Message.error('网络异常')
        })
    },
   // 跳转模板详情
    toDetail: function (id) {
      this.$router.push({
        name: 'addContent',
        query: {id: id}
      })
    },
    setPageSize(pageSize) {
      this.pageSize = pageSize;
      this.GetContentList()
    },
    // 换页
    changePage(pageNo) {
      this.pageNo = pageNo
      this.GetContentList()
    },
    GetContentList() {
      this.loading = true;
      let data = {
        pageNo: this.pageNo,
        pageSize: this.pageSize
      };
      getContentData(data)
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
  mounted () {

  }
}
</script>

<style scoped>
.colClass {
  text-align: center;
}

</style>
