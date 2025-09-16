<template lang="">
  <div class="field-block-wrapper">
    <n-collapse>
      <n-collapse-item :title="fieldTitle">
        <form>
          <div class="field-setting-container">
            <p>Input Label:</p>
            <n-input v-model:value="form.inputLabel" />
          </div>
          <div class="field-setting-container">
            <p>Input Type:</p>
            <n-select v-model:value="form.selectedInputType" :options="inputTypes" />
          </div>
          <div style="display: flex; width: 100%">
            <div class="field-setting-container">
              <n-switch v-model:value="form.required" /> Required
            </div>
            <div
              v-if="
                ['text', 'email', 'url', 'phone', 'address', 'date'].includes(
                  form.selectedInputType,
                )
              "
              class="field-setting-container"
            >
              <n-checkbox v-model:checked="form.isMultiple" />
              Multiple
            </div>
          </div>
          <div style="display: flex; width: 100%">
            <div class="field-setting-container">
              <n-radio-group v-if="form.isMultiple" v-model:value="multiSelectType">
                <n-radio-button
                  v-for="type in multiSelectTypes"
                  :key="type.value"
                  :value="type.value"
                  :label="type.label"
                />
              </n-radio-group>
            </div>
          </div>
          <div v-if="form.isMultiple" class="field-setting-container">
            <p>Options:</p>
            <n-select
              v-model:value="form.customSelectOptions"
              filterable
              multiple
              tag
              placeholder="Input Options (for select, radio, checkbox)"
              :show-arrow="false"
              :show="false"
            />
          </div>
          <div v-if="form.selectedInputType == 'number'" style="display: flex; width: 100%">
            <div class="field-setting-container">
              <p>Min:</p>
              <n-input-number v-model:value="form.minValue" clearable />
            </div>
            <div class="field-setting-container">
              <p>Max:</p>
              <n-input-number v-model:value="form.maxValue" clearable />
            </div>
          </div>
          <div class="field-setting-container">
            <p>Helper Text:</p>
            <n-input v-model:value="form.helperText" type="textarea" placeholder="" />
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
      form: {
        inputLabel: '',
        selectedInputType: null,
        isMultiple: false,
        multiSelectType: 'select',
        required: false,
        customSelectOptions: [],
        minValue: null,
        maxValue: null,
        helperText: '',
      },
    }
  },
  computed: {
    fieldTitle() {
      const label = this.form.inputLabel || this.formField.key
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

        // Boolean Types
        { label: 'Checkbox', value: 'checkbox' },
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
            this.form.selectedInputType = 'email'
          } else if (value.includes('http')) {
            this.form.selectedInputType = 'url'
          } else if (moment(value, moment.ISO_8601, true).isValid()) {
            this.form.selectedInputType = 'date'
          } else {
            this.form.selectedInputType = 'text'
          }
          break
        case 'number':
          this.form.selectedInputType = 'number'
          break
        case 'boolean':
          this.form.selectedInputType = 'checkbox'
          break
        default:
          this.form.selectedInputType = 'text'
      }
    },
    handleFormChange() {
      const settings = {
        label: this.form.inputLabel,
        key: this.form.inputLabel.toLowerCase(),
        type: this.form.selectedInputType,
        required: this.form.required,
        multiple: this.form.isMultiple,
        helperText: this.form.helperText,
      }
      if (this.form.isMultiple) {
        settings.multiSelectType = this.form.multiSelectType
      }
      if (this.form.selectedInputType === 'number') {
        settings.min = this.form.minValue
        settings.max = this.form.maxValue
      }
      this.$emit('settingsUpdate', settings)
    },
  },
  watch: {
    formField: {
      immediate: true,
      handler(newValue) {
        // Label
        this.form.inputLabel = newValue?.name || this.fieldTitle

        // Input Type
        this.setInputType(newValue?.type, newValue?.value)

        // Select Options
        this.form.customSelectOptions.push(newValue?.name || this.fieldTitle)

        // Set initial settings
        this.handleFormChange()
      },
    },
    form: {
      deep: true,
      handler() {
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
