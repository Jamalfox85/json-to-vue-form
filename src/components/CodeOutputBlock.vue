<template>
  <div class="block-wrapper">
    <h2>Code Output</h2>
    <p>Copy vue component code</p>
    <div class="input-block">
      <v-ace-editor
        v-model:value="content"
        lang="json"
        theme="monokai"
        style="height: 100%"
        @change="null"
      />
    </div>
  </div>
</template>
<script lang="ts">
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
