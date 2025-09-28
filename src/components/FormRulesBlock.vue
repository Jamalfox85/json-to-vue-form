<template>
  <div class="block-wrapper">
    <h2>Form Settings</h2>
    <p>Set input rules</p>
    <div class="rules-block">
      <FieldBlock
        v-for="(field, index) in jsonFormFields"
        :key="field"
        :formField="field"
        @settingsUpdate="updateFormFieldSettings(field.key, $event)"
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
      const fields = []

      Object.entries(parsedJSON).forEach(([key, value]) => {
        if (typeof value === 'object') {
          Object.entries(value).forEach(([subKey, subValue]) => {
            fields.push({
              key: `${subKey}`,
              value: subValue,
              type: typeof subValue,
            })
          })
        } else {
          fields.push({
            key,
            value,
            type: typeof value,
          })
        }
      })

      return fields
    },
    updateFormFieldSettings(key, settings) {
      this.formFieldSettings[key] = settings

      // convert settings object back to array
      const settingsArray = Object.entries(this.formFieldSettings).map(([key, value]) => ({
        key,
        ...value,
      }))
      this.$emit('settingsUpdate', settingsArray)
    },
  },
  watch: {
    parsedJSON: {
      immediate: true,
      handler(newVal) {
        if (!newVal) {
          this.jsonFormFields = []
          this.formFieldSettings = {}
          this.$emit('settingsUpdate', this.formFieldSettings)
          return
        }

        const newFields = this.generateFormFields(newVal)

        // merge: only add fields that don't exist yet
        newFields.forEach((f) => {
          if (!this.jsonFormFields.find((existing) => existing.key === f.key)) {
            this.jsonFormFields.push(f)
          }
        })
      },
    },
  },
}
</script>
<style lang="scss">
.rules-block {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  width: 450px;
  height: 0px;
  overflow-y: auto;
  margin-top: 1em;
  padding: 1em;
}
</style>
