<template>
    <Card class="ueditor">
      <vue-ueditor-wrap v-model="content" :config="myConfig"></vue-ueditor-wrap>
      {{ content }}
    </Card>
</template>

<script>
  import VueUeditorWrap from 'vue-ueditor-wrap'
  export default {
    name: 'Ueditor',
    components: {VueUeditorWrap},
    data () {
      return {
        myConfig: {
          // 如果需要上传功能,找后端小伙伴要服务器接口地址
          // serverUrl: this.$config.baseUrl + 'ueditor/ueditorConfig',
          serverUrl: this.$baseApi + '/ueditor/exec',
          // 你的UEditor资源存放的路径,相对于打包后的index.html
          UEDITOR_HOME_URL: '/ueditor/',
          // 编辑器不自动被内容撑高
          autoHeightEnabled: true,
          // 工具栏是否可以浮动
          autoFloatEnabled: false,
          // 初始容器高度
          initialFrameHeight: 340,
          // 初始容器宽度
          initialFrameWidth: '100%',
          // 关闭自动保存
          enableAutoSave: true
        },
        content: ''
      }
    }
  }
</script>

<style scoped>

</style>