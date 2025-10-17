<template>
  <div class="block-wrapper">
    <h2>Code Output</h2>
    <p>Copy vue component code</p>
    <div class="input-block">
      <NSpin v-if="loading" />
      <n-tabs v-if="!loading && exportCode && previewCode" type="segment" animated>
        <n-tab-pane name="code" tab="Code">
          <PreviewCodePane :key="exportCode" :content="exportCode" />
        </n-tab-pane>
        <n-tab-pane name="preview" tab="Preview">
          <PreviewPane :key="previewCode" :content="previewCode" />
        </n-tab-pane>
      </n-tabs>
    </div>
  </div>
</template>

<script>
import generateComponentString from '@/services/form-items/naiveui-options'

import { NTabs, NTabPane, NSpin } from 'naive-ui'
import PreviewCodePane from './PreviewCodePane.vue'
import PreviewPane from './PreviewPane.vue'
export default {
  components: { NTabs, NTabPane, PreviewCodePane, PreviewPane, NSpin },
  props: ['formFieldSettings', 'loadingProp'],
  data() {
    return {
      exportCode: '',
      previewCode: '',
      loading: false,
    }
  },
  methods: {
    generateComponent(formFields) {
      const { exportCode, previewCode } = generateComponentString(formFields)
      this.exportCode = exportCode
      this.previewCode = previewCode
    },
  },
  watch: {
    formFieldSettings: {
      deep: true,
      handler(newVal) {
        if (newVal) {
          if (newVal.length > 0) {
            this.generateComponent(newVal)
          } else {
            this.exportCode = ''
            this.previewCode = ''
          }
        }
      },
    },
    loadingProp: {
      handler(newVal) {
        this.loading = newVal
      },
    },
  },
}
</script>

<style lang="scss">
.n-tabs {
  .n-tabs-nav {
    .n-tabs-rail {
      background-color: #0a192f;
      color: #f5f5f5;
      border-radius: 8px;
      .n-tabs-capsule {
        background-color: rgba(66, 184, 131, 1);
        border-radius: 8px;
      }
      .n-tabs-tab__label {
        color: #f5f5f575;
      }
      .n-tabs-tab--active {
        .n-tabs-tab__label {
          color: #f5f5f5;
        }
      }
    }
  }
}
</style>
