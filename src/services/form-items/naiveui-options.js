import { c } from 'naive-ui'

export default function generateComponent(formFields) {
  const formFieldChunks = formFields.map((field) => {
    if (!field.type) return
    if (!field.active) return
    switch (field.type) {
      // String Types
      case 'text':
        if (field.isMultiple) {
          return genMultiSelect(field)
        } else {
          return genTextInput(field)
        }
      case 'email':
        return genEmailInput(field)
      case 'url':
        return genUrlInput(field)
      case 'phone':
        return genPhoneInput(field)
      case 'address':
        return genAddressInput(field)
      case 'date':
        return genDateInput(field)

      // Numeric Types
      case 'number':
        return genNumberInput(field)

      // Boolean Types
      case 'checkbox':
        return genCheckboxInput(field)

      default:
        return ''
    }
  })
  const template = `
<template>
  <n-form ref="formRef" @submit.prevent="handleSubmit" :model="formData" :rules="rules">
    ${formFieldChunks.join('\n    ')}
    <n-form-item>
      <n-button type="primary" @click="handleSubmit">Submit</n-button>
    </n-form-item>
  </n-form>
</template>
`

  const script = generateComponentScript(formFields)
  return template + script
}

function generateComponentScript(formFields) {
  const componentMapping = {
    text: 'NInput',
    email: 'NInput',
    url: 'NInput',
    phone: 'NInput',
    address: 'NInput',
    date: 'NDatePicker',
    number: 'NInputNumber',
    checkbox: 'NCheckbox',
  }
  let components = []
  formFields.forEach((field) => {
    const comp = componentMapping[field.type]
    if (comp && !components.includes(comp)) {
      components.push(comp)
    }
    if (field.isMultiple) {
      switch (field.multiSelectType) {
        case 'select':
          components.push('NSelect')
          break
        case 'radio':
          components.push('NRadioGroup', 'NRadioButton')
          break
        case 'button-group':
          components.push('NButtonGroup', 'NButton')
          break
      }
    }
  })

  const importString = `import {NForm, NFormItem, NButton, ${components.join(', ')}} from 'naive-ui'`
  const componentString = `components: { NForm, NFormItem, NButton, ${components.join(', ')} }`

  const rulesString = `
    rules: {
      ${formFields
        .map((field) => {
          if (!field.required) return ''
          return `
            ${field.key}: [
              {
                required: ${field.required},
                message: '${field.label} is required',
                trigger: ['input', 'submit'],
              },
            ]
          `
        })
        .filter(Boolean)
        .join(',')}
    }
  `
  const dataString = `
  data() {
    return {
        formRef: null,
        formData: {
          ${formFields
            .filter((field) => field.active)
            .map((field) => `${field.key}: null`)
            .join(',\n          ')}
        },
        ${rulesString}
    }
  }`
  const methodsString = `
  methods: {
    handleSubmit() {
      this.$refs.formRef.validate((errors) => {
        if (!errors) {
            console.log("✅ Submit:", this.formData);
        } else {
            console.log("❌ Validation failed:", errors);
        }
    });
    },
  }`

  return `<script>
  ${importString}

export default {
  ${componentString},
  ${dataString},
  ${methodsString}
}
</script>`
}

function genMultiSelect(field) {
  // Need to define options in compnent data property, b ut can't just call it "options". What if there are multiple multiselect form items
  let options = field.options.map((option) => {
    return {
      label: option.toUpperCase(),
      value: option,
    }
  })
  switch (field.multiSelectType) {
    case 'select':
      return `<n-form-item label="${field.label}" path="${field.key}">
  <n-select v-model:value="formData.${field.key}" :options="${options}" />
</n-form-item>`
    case 'radio':
      return `<n-form-item label="${field.label}" path="${field.key}">
  <n-radio-group v-model:value="formData.${field.key}">
    <n-radio-button v-for="option in ${options}" :key="option.value" :value="option.value">
      {{ option.label }}
    </n-radio-button>
  </n-radio-group>
</n-form-item>`
    case 'button-group':
      return `<n-form-item label="${field.label}" path="${field.key}">
  <n-button-group v-model:value="formData.${field.key}">
    <n-button v-for="option in ${options}" :key="option.value" :value="option.value">
      {{ option.label }}
    </n-button>
  </n-button-group>
</n-form-item>`
  }
}

function genTextInput(field) {
  return `<n-form-item label="${field.label}" path="${field.key}">
  <n-input v-model:value="formData.${field.key}"  />
</n-form-item>`
}

function genEmailInput(field) {
  return `
<n-form-item label="${field.label}" path="${field.key}">
  <n-input v-model:value="formData.${field.key}" type="email" />
</n-form-item>`
}

function genUrlInput(field) {
  return `
<n-form-item label="${field.label}" path="${field.key}">
  <n-input v-model:value="formData.${field.key}" type="url" />
</n-form-item>`
}

function genAddressInput(field) {
  return `
<n-form-item label="${field.label}" path="${field.key}">
  <n-input v-model:value="formData.${field.key}" />
</n-form-item>`
}

function genPhoneInput(field) {
  return `
<n-form-item label="${field.label}" path="${field.key}">
  <n-input v-model:value="formData.${field.key}" type="tel" />
</n-form-item>`
}

function genDateInput(field) {
  return `
<n-form-item label="${field.label}" path="${field.key}">
  <n-date-picker v-model:value="formData.${field.key}" />
</n-form-item>`
}

function genNumberInput(field) {
  return `
<n-form-item label="${field.label}" path="${field.key}">
  <n-input-number v-model:value="formData.${field.key}" />
</n-form-item>`
}

function genCheckboxInput(field) {
  return `
<n-form-item label="${field.label}" path="${field.key}">
  <n-checkbox v-model:value="formData.${field.key}" />
</n-form-item>`
}
