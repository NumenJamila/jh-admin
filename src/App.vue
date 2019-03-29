<template>
  <div id="app">
    <router-view/>
    <!-- <eg-loading :diaplay="this.getLoading"></eg-loading> -->
    <!-- 太丑了 -->
    <!-- <Spin size="large" fix v-if="this.getLoading"></Spin> -->
  </div>
</template>

<script>
import store from '@/store';
import { mapGetters } from "vuex";
export default {
  name: "App",
  computed: {
    ...mapGetters({
      getLoading: "getLoading"
    })
  }
};
</script>

<style lang="less">
.size {
  width: 100%;
  height: 100%;
}
html,
body {
  .size;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#app {
  .size;
}
</style>
