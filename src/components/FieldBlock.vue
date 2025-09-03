<template lang="">
  <div class="field-block-wrapper">
    <n-collapse :default-expanded-names="[fieldTitle]">
      <n-collapse-item :title="fieldTitle" :name="fieldTitle">
        <div class="field-setting-container">
          <p>Input Label:</p>
          <n-input v-model:value="inputLabel" />
        </div>
        <div class="field-setting-container">
          <p>Input Type:</p>
          <n-select v-model:value="selectedInputType" :options="inputTypes" />
        </div>
        <div class="field-setting-container"><n-switch v-model:value="required" /> Required</div>
        <div style="display: flex; width: 100%">
          <div class="field-setting-container">
            <n-checkbox v-model:checked="isMultiple" /> Multiple
          </div>
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
        <div class="field-setting-container">
          <p>Options:</p>
          <n-select v-model:value="customSelectOptions" filterable multiple tag />
        </div>
        <div class="field-setting-container">
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
      multiSelectType: null,
      required: false,
      customSelectOptions: [],
      minValue: null,
      maxValue: null,
      helperText: '',
    }
  },
  computed: {
    fieldTitle() {
      const capitalized = this.formField.key.charAt(0).toUpperCase() + this.formField.key.slice(1)
      return capitalized
    },
    inputTypes() {
      return [
        // String Types
        { label: 'Text', value: 'text' },
        { label: 'Email', value: 'email' },
        { label: 'URL', value: 'url' },
        { label: 'Phone', value: 'phone' },
        { label: 'Address', value: 'address' },

        // Numeric Types
        { label: 'Number', value: 'number' },

        // Date Types
        { label: 'Date', value: 'date' },
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
  watch: {
    // formField: {
    //   handler(newValue) {
    //     console.log('   <FieldBlock> name changed:', newValue)
    //     this.inputLabel = newValue.name
    //   },
    //   deep: true,
    //   immediate: true,
    // },
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
