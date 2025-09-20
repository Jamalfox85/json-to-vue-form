<template>
  <div class="app_wrapper">
    <div class="header">
      <h1 class="primary-header">JSON to Vue Form</h1>
    </div>
    <div class="main">
      <div class="col-block">
        <JSONInputBlock @jsonInput="handleJsonInput" />
      </div>
      <div class="col-block" :class="{ disabled: !parsedJSON }">
        <FormRulesBlock :parsedJSON="parsedJSON" @settingsUpdate="handleSettingsUpdate" />
      </div>
      <div class="col-block" :class="{ disabled: !parsedJSON }">
        <CodeOutputBlock :formFieldSettings="formFieldSettings" />
      </div>
    </div>
  </div>
</template>

<script>
import JSONInputBlock from './components/JSONInputBlock.vue'
import FormRulesBlock from './components/FormRulesBlock.vue'
import CodeOutputBlock from './components/CodeOutputBlock.vue'

export default {
  components: {
    JSONInputBlock,
    FormRulesBlock,
    CodeOutputBlock,
  },
  data() {
    return {
      jsonInput: '',
      parsedJSON: null,
      formFieldSettings: [],
    }
  },
  methods: {
    handleJsonInput(json) {
      this.jsonInput = json
      this.parseJSONFields(json)
    },
    parseJSONFields(json) {
      try {
        this.parsedJSON = JSON.parse(json)
      } catch (e) {
        console.error('Invalid JSON:', e)
      }
    },
    handleSettingsUpdate(updatedSettings) {
      this.formFieldSettings = updatedSettings
    },
  },
}
</script>

<style lang="scss">
.app_wrapper {
  display: flex;
  flex-direction: column;
  background-color: #e3e3e3;
  height: 100vh;

  .header {
    padding: 1em;
    border-bottom: solid 1px #eee;
    flex-shrink: 0;
  }

  .main {
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
    flex: 1 1 auto;
    padding: 1em;
    min-height: 0;
    gap: 1em;
    .col-block {
      flex: 1 1 400px;
      min-width: 300px;
      padding: 1em;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
      display: flex;
      flex-direction: column;
      min-height: 0;
      &.disabled {
        pointer-events: none;
        opacity: 0.25;
      }
      .block-wrapper {
        flex: 1 1 auto;
        min-height: 0;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    }
  }
}
</style>
