<template lang="">
  <div class="field-block-wrapper">
    <n-collapse>
      <n-collapse-item :title="fieldTitle">
        <form @change="handleFormChange">
          <div class="field-setting-container">
            <p>Input Label:</p>
            <n-input v-model:value="inputLabel" />
          </div>
          <div class="field-setting-container">
            <p>Input Type:</p>
            <n-select v-model:value="selectedInputType" :options="inputTypes" />
          </div>
          <div style="display: flex; width: 100%">
            <div class="field-setting-container">
              <n-switch v-model:value="required" /> Required
            </div>
            <div
              v-if="
                ['text', 'email', 'url', 'phone', 'address', 'date'].includes(selectedInputType)
              "
              class="field-setting-container"
            >
              <n-checkbox v-model:checked="isMultiple" />
              Multiple
            </div>
          </div>
          <div style="display: flex; width: 100%">
            <div class="field-setting-container">
              <n-radio-group v-if="isMultiple" v-model:value="multiSelectType">
                <n-radio-button
                  v-for="type in multiSelectTypes"
                  :key="type.value"
                  :value="type.value"
                  :label="type.label"
                />
              </n-radio-group>
            </div>
          </div>
          <div v-if="isMultiple" class="field-setting-container">
            <p>Options:</p>
            <n-select
              v-model:value="customSelectOptions"
              filterable
              multiple
              tag
              placeholder="Input Options (for select, radio, checkbox)"
              :show-arrow="false"
              :show="false"
            />
          </div>
          <div v-if="selectedInputType == 'number'" style="display: flex; width: 100%">
            <div class="field-setting-container">
              <p>Min:</p>
              <n-input-number v-model:value="minValue" clearable />
            </div>
            <div class="field-setting-container">
              <p>Max:</p>
              <n-input-number v-model:value="maxValue" clearable />
            </div>
          </div>
          <div class="field-setting-container">
            <p>Helper Text:</p>
            <n-input v-model:value="helperText" type="textarea" placeholder="" />
          </div>
        </form>
      </n-collapse-item>
    </n-collapse>
  </div>
</template>
<script>
import {
  NCollapse,
  NCollapseItem,
  NSelect,
  NCheckbox,
  NInput,
  NInputNumber,
  NSwitch,
  NRadioButton,
  NRadioGroup,
} from 'naive-ui'
import moment from 'moment'

export default {
  props: ['formField'],
  components: {
    NCollapse,
    NCollapseItem,
    NSelect,
    NCheckbox,
    NInput,
    NInputNumber,
    NSwitch,
    NRadioButton,
    NRadioGroup,
  },
  data() {
    return {
      inputLabel: '',
      selectedInputType: null,
      isMultiple: false,
      multiSelectType: 'select',
      required: false,
      customSelectOptions: [],
      minValue: null,
      maxValue: null,
      helperText: '',
    }
  },
  computed: {
    fieldTitle() {
      const label = this.inputLabel || this.formField.key
      return label.charAt(0).toUpperCase() + label.slice(1)
    },
    inputTypes() {
      return [
        // String Types
        { label: 'Text', value: 'text' },
        { label: 'Email', value: 'email' },
        { label: 'URL', value: 'url' },
        { label: 'Phone', value: 'phone' },
        { label: 'Address', value: 'address' },
        { label: 'Date Picker', value: 'date' },

        // Numeric Types
        { label: 'Number', value: 'number' },
      ]
    },
    multiSelectTypes() {
      return [
        { label: 'Select', value: 'select' },
        { label: 'Radio', value: 'radio' },
        { label: 'Button Group', value: 'button-group' },
      ]
    },
  },
  methods: {
    setInputType(type, value) {
      switch (type) {
        case 'string':
          if (value.includes('@')) {
            this.selectedInputType = 'email'
          } else if (value.includes('http')) {
            this.selectedInputType = 'url'
          } else if (moment(value, moment.ISO_8601, true).isValid()) {
            this.selectedInputType = 'date'
          } else {
            this.selectedInputType = 'text'
          }
          break
        case 'number':
          this.selectedInputType = 'number'
          break
        case 'boolean':
          this.selectedInputType = 'checkbox'
          break
        default:
          this.selectedInputType = 'text'
      }
    },
    handleFormChange() {
      const settings = {
        label: this.inputLabel,
        key: this.inputLabel.toLowerCase(),
        type: this.selectedInputType,
        required: this.required,
        multiple: this.isMultiple,
        helperText: this.helperText,
      }
      if (this.isMultiple) {
        settings.multiSelectType = this.multiSelectType
      }
      if (this.selectedInputType === 'number') {
        settings.min = this.minValue
        settings.max = this.maxValue
      }
      this.$emit('settingsUpdate', settings)
    },
  },
  watch: {
    formField: {
      immediate: true,
      handler(newValue) {
        // Label
        this.inputLabel = newValue?.name || this.fieldTitle

        // Input Type
        this.setInputType(newValue?.type, newValue?.value)

        // Select Options
        this.customSelectOptions.push(newValue?.name || this.fieldTitle)

        // Set initial settings
        this.handleFormChange()
      },
    },
  },
}
</script>
<style lang="scss">
.field-block-wrapper {
  border: solid 1px #ccc;
  padding: 1em;
  margin-bottom: 1em;
  .field-setting-container {
    flex: 1;
    margin: 4px 4px 8px 4px;
    p {
      font-weight: bold;
      margin-bottom: 4px;
    }
  }
}
.n-collapse-item {
  .n-collapse-item__header,
  .n-collapse-item__content-wrapper {
    .n-collapse-item__header-main,
    .n-collapse-item__content-inner,
    .n-collapse-item-arrow {
      color: #fff !important;
    }
  }
}
.n-checkbox {
  .n-checkbox__label {
    color: #fff !important;
  }
}
</style>
