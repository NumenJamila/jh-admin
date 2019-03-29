<template>
  <div>
    <Card>
      <Form :model="formItem" ref="formValidate" :label-width="80" :rules="rules">
        <FormItem label="文章内容" prop="textContent">
          <ueditor :value="formItem.textContent" :config="config" v-on:input="input" v-on:ready="ready" :random="editorRandom"></ueditor>
        </FormItem>
        <FormItem label="编码" prop="permissionCode">
          <Button type="text" size="large" @click="">取消</Button>
          <Button type="primary" size="large" @click="">确定</Button>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
import ueditor from "./comm/ueditor.vue";
import {
  addPermissionData,
  deletePermissionData,
  updatePermissionData,
  getPermissionData
} from "@/api/data";
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters({
      jurisdiction: "jurisdiction"
    })
  },
  name: "permission",
  components: {
    ueditor
  },
  data() {
    var isNotEmpty = (rule, value, callback) => {
      if (!value || value.replace(/\s*/g, "") === "") {
        return callback(new Error(""));
      } else {
        callback();
      }
    };
    return {
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 320
			},
			editorRandom: Math.random(),
      formItem: {
        id: undefined,
        name: "",
        permissionDesc: "",
        permissionCode: ""
      },

      rules: {
        name: [
          { required: true, validator: isNotEmpty, trigger: "blur" },
          { min: 2, message: "角色中文名称不可少于2个字", trigger: "blur" },
          { max: 20, message: "角色中文名称不可超过20个字", trigger: "blur" }
        ]
      },
    };
  },
  methods: {
    input: function(content) {
      this.textContent = content.content;
		},
		ready: function() {},
  },
  mounted() {
    
  }
};
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
