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
      formFieldSettings: [],
    }
  },
  methods: {
    generateFormFields(parsedJSON) {
      Object.entries(parsedJSON).forEach(([key, value]) => {
        if (typeof value == 'object') {
          Object.entries(value).forEach(([subKey, subValue]) => {
            this.jsonFormFields.push({
              key: `${subKey}`,
              value: subValue,
              type: typeof subValue,
            })
          })
        } else {
          this.jsonFormFields.push({
            key,
            value,
            type: typeof value,
          })
        }
        console.log('Type: ', typeof value)
      })
    },
    updateFormFieldSettings(index, settings) {
      this.formFieldSettings[index] = settings
      console.log('Form Field Settings:', this.formFieldSettings)
      this.$emit('settingsUpdate', this.formFieldSettings)
    },
  },
  watch: {
    parsedJSON: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          // this currently resets settings on every json change. If a user adds json, tweaks settings, and then updates the json, they'll have to start over. Fix this eventually
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
