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
      <!-- <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
      <!-- <div style="text-align: center;padding:14px 0 0;">
        <Page
          :total="entityCount"
          show-sizer
          :page-size-opts="[5, 10, 20, 50]"
          @on-page-size-change="setPageSize"
          :current="pageNo"
          :page-size="pageSize"
          @on-change="changePage"
        ></Page>
      </div>-->
      <Button v-if="true" class="search-btn loc" @click="newModalFunc" type="primary">
        <Icon type="search"/>新建任务
      </Button>
      <Modal v-model="newModal" :title="modalTitle" :loading="modelLoading">
        <Form :model="formItem" ref="formValidate" :label-width="80" :rules="rules">
          <FormItem label="任务名称" prop="jobName">
            <Input v-model="formItem.jobName" placeholder="请输入任务名称"></Input>
          </FormItem>
          <FormItem label="任务分组" prop="jobGroup">
            <Input v-model="formItem.jobGroup" placeholder="请输入任务分组"></Input>
          </FormItem>
          <FormItem label="任务描述" prop="description">
            <Input v-model="formItem.description" placeholder="请输入任务描述"></Input>
          </FormItem>
          <FormItem label="执行类" prop="jobClassName">
            <Input v-model="formItem.jobClassName" placeholder="请输入执行类"></Input>
          </FormItem>
          <FormItem label="执行时间" prop="cronExpression">
            <Input v-model="formItem.cronExpression" placeholder="请输入任务执行时间"></Input>
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
  resumeJobData,
  triggerJobData,
  pauseJobData,
  addJobData,
  deleteJobData,
  updateJobData,
  getJobData
} from '@/api/data'
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      jurisdiction: 'jurisdiction'
    })
  },
  name: 'tables_page',
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
      modalTitle: '新建任务',
      modelLoading: true,
      formItem: {
        jobName: '',
        jobGroup: '',
        description: '',
        jobClassName: '',
        triggerState: '',
        cronExpression: '',
        // 旧任务名称  用于修改
        oldJobName: '',
        oldJobGroup: ''
      },

      rules: {
        jobName: [
          { required: true, validator: isNotEmpty, trigger: 'blur' },
          { min: 2, message: '任务名称不可少于2个字', trigger: 'blur' },
          { max: 20, message: '任务名称不可超过20个字', trigger: 'blur' }
        ],
        description: [
          { required: true, validator: isNotEmpty, trigger: 'blur' },
          { min: 2, message: '任务描述不可少于2个字', trigger: 'blur' },
          { max: 20, message: '任务描述不可超过20个字', trigger: 'blur' }
        ],
        jobClassName: [
          { required: true, validator: isNotEmpty, trigger: 'blur' }
        ],
        cronExpression: [
          { required: true, validator: isNotEmpty, trigger: 'blur' },
          { min: 2, message: '执行时间不可少于2个字', trigger: 'blur' },
          { max: 20, message: '执行时间不可超过20个字', trigger: 'blur' }
        ],
        jobGroup: [
          {
            required: true,
            validator: isNotEmpty,
            message: '请输入任务分组',
            trigger: 'blur'
          },
          { min: 2, message: '任务分组不可少于2个字', trigger: 'blur' },
          { max: 20, message: '任务分组不可超过200个字', trigger: 'blur' }
        ]
      },
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
          title: '任务名称',
          key: 'jobName',
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
                      this.addTwoJob('params.row')
                    }
                  }
                },
                params.row.jobName
              )
            ])
          }
        },
        { title: '任务分组', key: 'jobGroup', align: 'center' },
        { title: '描述', key: 'description', align: 'center' },
        { title: '执行类', key: 'jobClassName', align: 'center' },
        { title: '执行时间', key: 'cronExpression', align: 'center' },
        {
          title: '操作',
          align: 'center',
          width: '280',
          className: 'ivu-table-cell',
          key: 'action',
          render: (h, params) => {
            var functionList = []
            var that = this
            // 执行
            var trigger = h(
              'Button',
              {
                props: {
                  type: 'primary',
                  size: 'small',
                  icon: 'ios-play'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: function () {
                    that.trigger(params.row.jobName, params.row.jobGroup)
                  }
                }
              },
              '执行'
            )
            functionList.push(trigger)
            // 修改
            var edit = h(
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
                  click: function () {
                    that.editBus(params.row)
                  }
                }
              },
              '修改'
            )
            functionList.push(edit)
            // 移除
            var remove = h(
              'Poptip',
              {
                props: {
                  confirm: true,
                  title: '您确定要删除这条数据吗?',
                  transfer: true
                },
                on: {
                  'on-ok': () => {
                    this.deleteMenu(params.row.id)
                  }
                }
              },
              [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    icon: 'ios-trash'
                  },
                  style: {
                    marginRight: '5px'
                  }
                }, '移除')
              ]
            )
            // var remove = h(
            //   'Poptip',
            //   {
            //     props: {
            //       confirm: true,
            //       title: '您确定要删除这条数据吗?',
            //       transfer: true,
            //       type: "primary",
            //       size: "small",
            //       icon: "ios-trash"
            //     },
            //     style: {
            //       marginRight: "5px"
            //     },
            //     on: {
            //       click: function() {
            //         that.deleteJob(params.row.jobName, params.row.jobGroup);
            //       }
            //     }
            //   },
            //   "移除"
            // );
            functionList.push(remove)
            if (params.row.triggerState == 'PAUSED') {
              // 恢复
              var resume = h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small',
                    icon: 'md-refresh-circle'
                  },
                  style: {
                    // marginRight: "8px"
                  },
                  on: {
                    click: function () {
                      that.resume(params.row.jobName, params.row.jobGroup)
                    }
                  }
                },
                '恢复'
              )
              functionList.push(resume)
            } else {
              // 停止
              var pause = h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small',
                    icon: 'ios-pause'
                  },
                  style: {
                    // marginRight: "8px"
                  },
                  on: {
                    click: function () {
                      that.pause(params.row.jobName, params.row.jobGroup)
                    }
                  }
                },
                '停止'
              )
              functionList.push(pause)
            }
            // 返回方法集合
            return h('div', functionList)
          }
        }
      ],
      tableData: []
    }
  },
  methods: {
    // 执行一次
    trigger: function (jobName, jobGroup) {
      let data = {
        time: new Date().toString(),
        jobName: jobName,
        jobGroup: jobGroup
      }
      triggerJobData(data)
        .then(res => {
          this.loading = false
          if (res.data.isSuccess) {
            this.$Notice.success({
              desc: '任务执行成功'
            })
            this.startToGetJobList()
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
    // 停止任务
    pause (jobName, jobGroup) {
      let data = {
        time: new Date().toString(),
        jobName: jobName,
        jobGroup: jobGroup
      }
      pauseJobData(data)
        .then(res => {
          this.loading = false
          if (res.data.isSuccess) {
            this.$Notice.success({
              desc: '停止任务成功'
            })
            this.startToGetJobList()
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
    // 恢复任务
    resume (jobName, jobGroup) {
      let data = {
        time: new Date().toString(),
        jobName: jobName,
        jobGroup: jobGroup
      }
      resumeJobData(data)
        .then(res => {
          this.loading = false
          if (res.data.isSuccess) {
            this.$Notice.success({
              desc: '恢复任务成功'
            })
            this.startToGetJobList()
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

    // 唤起新增权限
    addTwoJob (id) {
      // alert(id);
    },
    // 唤起新增角色对话框
    newModalFunc () {
      this.modalTitle = '新增任务';
      (this.formItem = {
        jobName: '',
        jobGroup: '',
        description: '',
        jobClassName: '',
        triggerState: '',
        cronExpression: '',
        // 旧任务名称  用于修改
        oldJobName: '',
        oldJobGroup: ''
      }),
      (this.newModal = true)
    },
    // 唤起修改对话框
    editBus: function (quartz) {
      this.modalTitle = '修改权限'
      this.formItem = {
        jobName: quartz.jobName,
        jobGroup: quartz.jobGroup,
        description: quartz.description,
        jobClassName: quartz.jobClassName,
        triggerState: quartz.triggerState,
        cronExpression: quartz.cronExpression,
        // 旧任务名称  用于修改
        oldJobName: quartz.jobName,
        oldJobGroup: quartz.jobGroup
      }
      this.newModal = true
    },
    // 删除菜单
    deleteJob (jobName, jobGroup) {
      let data = {
        time: new Date().toString(),
        jobName: jobName,
        jobGroup: jobGroup
      }
      deleteJobData(data)
        .then(res => {
          this.loading = false
          if (res.data.isSuccess) {
            this.$Message.info('已删除任务')
            this.startToGetJobList()
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
    // 新建、修改任务
    modalOk () {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          if (!this.formItem.oldJobName && !this.formItem.oldJobGroup) {
            addJobData(this.formItem)
              .then(res => {
                if (res.data.isSuccess) {
                  this.$Message.info('添加成功')
                  this.newModal = false
                  this.startToGetJobList()
                } else {
                  this.$Message.error('添加失败：' + res.data.msg)
                }
              })
              .catch(res => {
                this.$Message.error('网络异常')
              })
          } else {
            updateJobData(this.formItem)
              .then(res => {
                if (res.data.isSuccess) {
                  this.$Message.info('修改成功')
                  this.newModal = false
                  this.startToGetJobList()
                } else {
                  this.$Message.error('请求失败：' + res.data.msg)
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
        jobName: '',
        jobGroup: '',
        description: '',
        jobClassName: '',
        triggerState: '',
        cronExpression: '',
        // 旧任务名称  用于修改
        oldJobName: '',
        oldJobGroup: ''
      }
      this.newModal = false
    },

    startToGetJobList () {
      this.loading = true
      getJobData()
        .then(res => {
          this.loading = false
          if (res.data.isSuccess) {
            console.log(res)
            this.tableData = res.data.data
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
    this.startToGetJobList();
  }
}
</script>

<style scoped>
.ivu-table-cell {
  padding: 0 5px !important;
}
.loc {
  position: absolute;
  right: 17px;
  top: 26px;
}
</style>
