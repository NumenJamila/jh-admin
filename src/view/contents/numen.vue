<template>
  <div>
    <Tag
      v-for="item in tagList"
      :key="item"
      :name="item"
      closable
      @on-close="handleClose2"
    >{{ item }}</Tag>
    <Input v-model="tagTemp" placeholder="回车确定" class="TagInput" @on-enter="handleAdd"></Input>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tagList: [],
      tagTemp: "",
      formItem: {
        tagName: ""
      }
    };
  },
  methods: {
    handleAdd() {
      if (this.tagTemp) {
        this.tagList.push(this.tagTemp);
        this.tagTemp = "";
        if (this.tagList.length >= 0) {
          this.formItem.tagName = this.tagList.join(",");
        }
      }
    },
    handleClose2(event, name) {
      console.log(event);
      console.log(name);
      const index = this.tagList.indexOf(name);
      this.tagList.splice(index, 1);
    }
  }
};
</script>

<style scoped>
</style>
