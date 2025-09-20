<template>
  <div class="block-wrapper">
    <h2>Code Output</h2>
    <p>Copy vue component code</p>
    <div class="input-block">
      <n-tabs type="segment" animated>
        <n-tab-pane name="code" tab="Code">
          <PreviewCodePane :key="content" :content="content" />
        </n-tab-pane>
        <n-tab-pane name="preview" tab="Preview">
          <PreviewPane :content="content" />
        </n-tab-pane>
      </n-tabs>
    </div>
  </div>
</template>

<script>
import generateComponentString from '@/services/form-items/naiveui-options'

import { NTabs, NTabPane } from 'naive-ui'
import PreviewCodePane from './PreviewCodePane.vue'
import PreviewPane from './PreviewPane.vue'
export default {
  components: { NTabs, NTabPane, PreviewCodePane, PreviewPane },
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
  },
  mounted() {},
  watch: {
    formFieldSettings: {
      deep: true,
      handler(newVal) {
        if (newVal) {
          if (newVal.length > 0) {
            this.generateComponent(newVal)
          } else {
            this.content = ''
          }
        }
      },
    },
  },
}
</script>

<style lang="scss"></style>
