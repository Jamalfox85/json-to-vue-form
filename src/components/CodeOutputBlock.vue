<template>
  <div class="block-wrapper">
    <h2>Code Output</h2>
    <p>Copy vue component code</p>
    <div class="input-block">
      <n-tabs type="segment" animated @update:value="handleTabChange">
        <n-tab-pane name="code" tab="Code">
          <pre><code ref="codeBlock" class="language-html">{{ content }}</code></pre>
        </n-tab-pane>
        <n-tab-pane name="preview" tab="Preview">
          <PreviewPane :content="content" />
        </n-tab-pane>
      </n-tabs>
    </div>
  </div>
</template>

<script>
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css' // pick a theme you like
import generateComponentString from '@/services/form-items/naiveui-options'

import { NTabs, NTabPane } from 'naive-ui'
import PreviewPane from './PreviewPane.vue'
export default {
  components: { NTabs, NTabPane, PreviewPane },
  props: ['formFieldSettings'],
  data() {
    return {
      content: '',
    }
  },
  methods: {
    handleChange(value) {
      this.content = value
    },
    generateComponent(formFields) {
      const template = generateComponentString(formFields)
      this.content = template
    },
    highlightCode() {
      this.$nextTick(() => {
        if (this.codeBlock) {
          delete this.codeBlock.dataset.highlighted
          hljs.highlightElement(this.codeBlock)
        }
      })
    },
    handleTabChange(newTab) {
      console.log('NEW TAB:', newTab)
      if (newTab === 'code') {
        console.log('PING')
        this.highlightCode()
      }
    },
  },
  mounted() {
    this.codeBlock = this.$refs.codeBlock
  },
  watch: {
    formFieldSettings: {
      deep: true,
      handler(newVal) {
        if (newVal) {
          this.generateComponent(newVal)
          this.highlightCode()
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
