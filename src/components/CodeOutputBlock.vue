<template>
  <div class="block-wrapper">
    <h2>Code Output</h2>
    <p>Copy vue component code</p>
    <div class="input-block">
      <NSpin v-if="loading" />
      <n-tabs v-if="!loading && exportCode && previewCode" type="segment" animated>
        <n-tab-pane name="code" tab="Code">
          <div class="tab-settings">
            <div class="section-header">
              <p>Select Vue API</p>
            </div>
            <div class="options-group">
              <n-radio-group v-model:value="vueAPI" name="vueApi">
                <n-radio-button
                  v-for="option in apiOptions"
                  :key="option.value"
                  :value="option.value"
                  :label="option.label"
                />
              </n-radio-group>
            </div>
          </div>
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

import { NTabs, NTabPane, NSpin, NRadioGroup, NRadioButton } from 'naive-ui'
import PreviewCodePane from './PreviewCodePane.vue'
import PreviewPane from './PreviewPane.vue'
export default {
  components: { NTabs, NTabPane, PreviewCodePane, PreviewPane, NSpin, NRadioGroup, NRadioButton },
  props: ['formFieldSettings', 'loadingProp'],
  data() {
    return {
      exportCode: '',
      previewCode: '',
      loading: false,
      vueAPI: 'options', // options or composition
      apiOptions: [
        { label: 'Options API', value: 'options' },
        { label: 'Composition API', value: 'composition' },
      ],
    }
  },
  methods: {
    generateComponent(formFields) {
      const { exportOptionsCode, exportCompositionCode, previewCode } =
        generateComponentString(formFields)

      this.exportCode = this.vueAPI == 'options' ? exportOptionsCode : exportCompositionCode
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
    vueAPI: {
      handler() {
        this.generateComponent(this.formFieldSettings)
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
.tab-settings {
  padding: 1em;
  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5em;
    color: #fff;
  }
}
.n-radio-group {
  .n-radio-button {
    background-color: #0a192f;
    color: #fff !important;
    border: none !important;
    &.n-radio-button--checked {
      background-color: rgba(66, 184, 131, 1);
    }
  }
}
</style>
