<template>
  <div class="app_wrapper">
    <div class="header">
      <!-- Color Palette -->
      <!-- https://coolors.co/1be7ff-6eeb83-e4ff1a-e8aa14-ff5714 -->
      <h1 class="primary-header">JSON to Vue Form</h1>
    </div>
    <div class="main">
      <div class="col-block">
        <JSONInputBlock @jsonInput="handleJsonInput" />
      </div>
      <div class="col-block">
        <FormRulesBlock :parsedJSON="parsedJSON" @settingsUpdate="handleSettingsUpdate" />
      </div>
      <div class="col-block">
        <CodeOutputBlock :formFieldSettings="formFieldSettings" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
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
    handleJsonInput(json: string) {
      this.jsonInput = json
      this.parseJSONFields(json)
    },
    parseJSONFields(json: string) {
      try {
        this.parsedJSON = JSON.parse(json)
      } catch (e) {
        console.error('Invalid JSON:', e)
        return
      }
    },
    handleSettingsUpdate(updatedSettings: any) {
      this.formFieldSettings = updatedSettings
    },
  },
}
</script>

<style lang="scss">
.app_wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4em;
    border: solid 2px red;
  }
  .main {
    padding: 4em;
    display: flex;
    justify-content: space-evenly;
    border: solid 2px cyan;
    width: 100%;
    .col-block {
      border: solid 2px yellow;
      flex-grow: 1;
      .block-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        border: solid 2px green;
      }
    }
  }
}
</style>
