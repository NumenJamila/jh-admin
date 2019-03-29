<template>
  <div ref="editor" class="ueditor-container"></div>
</template>

<script>
  export default {
    data() {
      return {
        id: 'ueditor' + parseInt(Math.random() * 100000),
        isEditorReady: false
      };
    },
    props: {
      value: {
        type: String,
        default: null,
      },
      config: {
        type: Object,
        default: {},
      },
      disabled: {
        type: Boolean,
        default: false
      },
      random: {
        type: Number,
        default: null
      }
    },
    watch: {
      value: function (val, oldVal) {
        if (this.isEditorReady) {
          this.editor = UE.getEditor(this.id, this.config);
          if (val !== null) {
            this.editor.setContent(val);
            this.editor.focus(true)
          }
        }
      },
      random: function () {
        if (this.isEditorReady) {          
          const wordCount = this.editor.getContentLength(true);
          const content = this.editor.getContent();
          const plainTxt = this.editor.getPlainTxt();
          this.$emit('input', { wordCount: wordCount, content: content, plainTxt: plainTxt });
        }
      }
    },
    mounted () {
      this.$nextTick(function f1() {
        // 保证 this.$el 已经插入文档
        if (this.$refs.editor) {
          this.$refs.editor.id = this.id;
          this.editor = UE.getEditor(this.id, this.config);
          this.editor.ready(function f2() {
            this.isEditorReady = true
            this.editor.setContent(this.value);

            this.editor.addListener("contentChange", function () {
              const wordCount = this.editor.getContentLength(true);
              const content = this.editor.getContent();
              const plainTxt = this.editor.getPlainTxt();
              this.$emit('input', { wordCount: wordCount, content: content, plainTxt: plainTxt });
            }.bind(this));

            this.$emit('ready', this.editor);

            let self = this
            if (this.disabled) {
              self.editor.setDisabled();
            } else {
              self.editor.setEnabled();
            }
          }.bind(this));
        }
      });
    },
    beforeDestroy() {
      // $('.ueditor-container').hide() // 销毁前隐藏文本框
      try {
          this.editor && this.editor.destroy();
          this.editor = null;
      } catch (e) {
          this.editor = null;
      }
    }
  };
</script>

<style>
    body{
        background-color:#ff0000;
    }
</style>
