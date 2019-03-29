<template>
  <div>
    <Card>
    <Upload
      ref="upload"
      :before-upload="handleUpload"
      :on-success="handleSuccess"
      :on-error="handleError"
      :action="uploadUrl"
			:on-preview="filePreview"
			:default-file-list="defaultList"
    >
      <Button icon="ios-cloud-upload-outline">点击选择文件</Button>
    </Upload>
    <div v-if="file !== null">
      上传文件名: {{ file.name }}
      <Button
        type="text"
        @click="upload"
        :loading="loadingStatus"
      >{{ loadingStatus ? '上传中' : '上传' }}</Button>
    </div>
    </Card>
  </div>
</template>
<script>
export default {
  data() {
    return {
			defaultList: [],
			uploadUrl: "",
			fileUrl: "",
      file: null,
      loadingStatus: false
    };
  },
  methods: {
    handleUpload(file) {
      this.file = file;
      return false;
    },
    upload() {
      this.loadingStatus = true;
      this.$refs.upload.post(this.file);
    },
    handleSuccess(res, file) {
      // 文件上传回调 上传成功后删除待上传文件
      if(res.code === 200) {
				this.$Message.info("上传成功");
				this.loadingStatus = false;
				this.fileUrl = res.url
				let fileObj = {
					'name': res.url,
					'url': res.url
				}
				this.defaultList.push(fileObj)
			}
		},
		handleError(res, file) {
			this.$Message.error("上传失败");
			this.loadingStatus = false;
		},
		filePreview(file) {
			window.location.href = file.url
		}
  },
  mounted() {
    this.uploadUrl = this.$baseApi + "/demo/upload";
  }
};
</script>
