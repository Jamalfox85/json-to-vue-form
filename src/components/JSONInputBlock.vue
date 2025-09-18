<template>
  <div class="block-wrapper">
    <h2>JSON Input</h2>
    <p>Enter or paste your example JSON output</p>
    <div class="input-block">
      <v-ace-editor
        v-model:value="content"
        lang="json"
        theme="monokai"
        style="width: 100%"
        @change="debouncedHandleChange"
      />
    </div>
  </div>
</template>
<script>
import { VAceEditor } from 'vue3-ace-editor'
import debounce from 'lodash.debounce'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-monokai'
export default {
  components: { VAceEditor },
  data() {
    return {
      content: '',
    }
  },
  created() {
    this.debouncedHandleChange = debounce(() => {
      this.handleChange(this.content)
    }, 1000)
  },
  methods: {
    handleChange(json) {
      if (json.length === 0) return
      this.$emit('jsonInput', json)
    },
  },
}
</script>
<style lang="scss">
.input-block {
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
  margin-top: 1em;
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  .ace_editor,
  .v-ace-editor {
    flex: 1 1 auto;
    min-height: 0;
  }
}
</style>
