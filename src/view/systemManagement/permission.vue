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
        v-if="jurisdiction['systemManagement:roleManagement:list']"
        class="search-btn loc"
        @click="newModalFunc"
        type="primary"
      >
        <Icon type="search"/>新建权限
      </Button>
      <Modal v-model="newModal" :title="modalTitle" :loading="modelLoading">
        <Form :model="formItem" ref="formValidate" :label-width="80" :rules="rules">
          <FormItem label="名称" prop="name">
            <Input v-model="formItem.name" placeholder="Enter something..."></Input>
          </FormItem>
          <FormItem label="描述" prop="permissionDesc">
            <Input v-model="formItem.permissionDesc" placeholder="Enter something..."></Input>
          </FormItem>
          <FormItem label="编码" prop="permissionCode">
            <Input v-model="formItem.permissionCode" placeholder="Enter something..."></Input>
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
  name: 'permission',
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
      modalTitle: '新建权限',
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
          title: '名称',
          key: 'name',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'a',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.addTwoPermission(params.row.id, params.row.level)
                    }
                  }
                },
                params.row.name
              )
            ])
          }
        },
        { title: '描述', key: 'permissionDesc', align: 'center' },
        { title: '权限编码', key: 'permissionCode', align: 'center' },
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
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.editBus(
                        params.row.id,
                        params.row.name,
                        params.row.permissionDesc,
                        params.row.permissionCode
                      )
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
                      this.detelePermission(params.row.id)
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
                        marginRight: '5px'
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
    // 唤起新增权限
    addTwoPermission (id) {
      alert(id)
    },
    // 唤起新增角色对话框
    newModalFunc () {
      this.modalTitle = '新增权限'
      this.newModal = true
    },
    // 唤起修改对话框
    editBus (id, name, permissionDesc, permissionCode) {
      this.modalTitle = '新增权限'
      this.formItem = {
        id: id,
        name: name,
        permissionDesc: permissionDesc,
        permissionCode: permissionCode
      }
      this.newModal = true
    },
    // 删除权限
    detelePermission (id) {
      deletePermissionData(id)
        .then(res => {
          this.loading = false
          if (res.data.isSuccess) {
            this.$Message.info('已删除权限')
            this.startToGetPermissionList()
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
    // 新建、修改菜单
    modalOk () {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          if (!this.formItem.id || this.formItem.id === undefined) {
            addPermissionData(this.formItem)
              .then(res => {
                if (res.data.isSuccess) {
                  this.$Message.info('添加成功')
                  this.newModal = false
                  this.startToGetPermissionList()
                } else {
                  this.$Message.error("请求失败:" + res.data.msg)
                }
              })
              .catch(res => {
                this.$Message.error('网络异常')
              })
          } else {
            updatePermissionData(this.formItem)
              .then(res => {
                if (res.data.isSuccess) {
                  this.$Message.info('修改成功')
                  this.newModal = false
                  this.startToGetPermissionList()
                } else {
                  this.$Message.error("请求失败:" + res.data.msg)
                }
              })
              .catch(res => {
                this.$Message.error('网络异常')
              })
          }
        } else {
        }
      })
    },
    modalCancel () {
      this.formItem = {
        id: undefined,
        name: '',
        permissionDesc: '',
        permissionCode: ''
      }
      this.newModal = false
    },

    setPageSize (pageSize) {
      this.pageSize = pageSize
      console.log(pageSize)
      this.changePage(this.pageNo)
    },
    // 换页
    changePage (pageNo) {
      this.loading = true
      let data = {
        pageNo: pageNo,
        pageSize: this.pageSize
      }
      getPermissionData(data)
        .then(res => {
          this.loading = false
          if (res.data.isSuccess) {
            this.tableData = res.data.data.entities
            this.entityCount = res.data.data.entityCount
          } else {
            this.$Message.error("请求失败:" + res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
          this.loading = false
          this.$Message.error('网络异常')
        })
    },
    startToGetPermissionList () {
      this.loading = true
      let data = {
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      getPermissionData(data)
        .then(res => {
          this.loading = false
          if (res.data.isSuccess) {
            console.log(res)
            this.tableData = res.data.data.entities
            this.entityCount = res.data.data.entityCount
          } else {
          }
        })
        .catch(err => {
          this.loading = false
          console.log(err)
        })
    }
  },
  mounted () {
    this.startToGetPermissionList()
  }
}
</script>

<style scoped>
.colClass {
  text-align: center;
}
.loc {
  position: absolute;
  right: 17px;
  top: 26px;
}
</style>
