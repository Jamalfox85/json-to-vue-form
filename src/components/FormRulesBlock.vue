<template>
  <div class="block-wrapper">
    <h2>Form Settings</h2>
    <p>Set input rules</p>
    <div class="rules-block">
      <FieldBlock
        v-for="(field, index) in jsonFormFields"
        :key="index"
        :formField="field"
        @settingsUpdate="updateFormFieldSettings(index, $event)"
      />
    </div>
  </div>
</template>
<script>
import FieldBlock from './FieldBlock.vue'
export default {
  props: ['parsedJSON'],
  components: {
    FieldBlock,
  },
  data() {
    return {
      jsonFormFields: [],
      formFieldSettings: {},
    }
  },
  methods: {
    generateFormFields(parsedJSON) {
      Object.entries(parsedJSON).forEach(([key, value]) => {
        this.jsonFormFields.push({
          key,
          value,
          type: typeof value,
        })
      })
    },
    updateFormFieldSettings(index, settings) {
      this.formFieldSettings[index] = settings
      this.$emit('settingsUpdate', this.formFieldSettings)
    },
  },
  watch: {
    parsedJSON: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.jsonFormFields = []
          this.generateFormFields(newVal)
        }
      },
    },
  },
}
</script>
<style lang="scss">
.rules-block {
  border: solid 2px red;
  width: 450px;
  height: 800px;
  margin-top: 1em;
  display: flex;
  flex-direction: column;
  padding: 1em;
}
</style>
