<template>
  <div class="block-wrapper">
    <h2>Code Output</h2>
    <p>Copy vue component code</p>
    <div class="input-block">
      <v-ace-editor
        v-model:value="content"
        lang="javascript"
        theme="monokai"
        style="height: 100%"
        @change="null"
      />
    </div>
  </div>
</template>
<script>
import { VAceEditor } from 'vue3-ace-editor'
import debounce from 'lodash.debounce'
import 'ace-builds/src-noconflict/mode-html'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/theme-monokai'
import prettier from 'prettier'
import parserBabel from 'prettier/parser-babel'
import parserHtml from 'prettier/parser-html'

export default {
  components: { VAceEditor },
  props: ['formFieldSettings'],
  data() {
    return {
      content: '',
    }
  },
  methods: {
    updateContent() {
      let rawCode = `<template>Test</template>`
      this.content = rawCode
    },
  },
  watch: {
    formFieldSettings: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          console.log('NEW VALUE:', newVal)
          this.updateContent()
        }
      },
    },
  },
}
</script>
<style lang="scss">
.input-block {
  border: solid 2px red;
  width: 450px;
  height: 800px;
  margin-top: 1em;
}
</style>
