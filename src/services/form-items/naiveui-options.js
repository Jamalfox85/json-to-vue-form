import { c } from 'naive-ui'

export default function generateComponent(formFields) {
  const formFieldChunks = generateFormFieldChunks(formFields)
  const formFieldChunksPreviewOnly = generateFormFieldChunks(formFields, true)

  const exportTemplate = `
<template>
  <n-form ref="formRef" @submit.prevent="handleSubmit" :model="formData" :rules="rules">
    ${formFieldChunks.join('\n    ')}
    <n-form-item>
      <n-button type="primary" @click="handleSubmit">Submit</n-button>
    </n-form-item>
  </n-form>
</template>
`

  const previewTemplate = `
<template>
  <n-form ref="formRef" @submit.prevent="handleSubmit" :model="formData" :rules="rules">
    ${formFieldChunksPreviewOnly.join('\n    ')}
    <n-form-item>
      <n-button type="primary" @click="handleSubmit">Submit</n-button>
    </n-form-item>
  </n-form>
</template>
`

  const script = generateComponentScript(formFields)

  return {
    exportCode: exportTemplate + script,
    previewCode: previewTemplate + script,
  }
}

function generateFormFieldChunks(formFields, previewOnly = false) {
  const formFieldChunks = formFields.map((field) => {
    if (!field.type) return
    if (!field.active) return
    switch (field.type) {
      // String Types
      case 'text':
        if (field.isMultiple) {
          return genMultiSelect(field, previewOnly)
        } else {
          return genTextInput(field, previewOnly)
        }
      case 'email':
        return genEmailInput(field, previewOnly)
      case 'url':
        return genUrlInput(field, previewOnly)
      case 'phone':
        return genPhoneInput(field, previewOnly)
      case 'address':
        return genAddressInput(field, previewOnly)
      case 'date':
        return genDateInput(field, previewOnly)

      // Numeric Types
      case 'number':
        return genNumberInput(field, previewOnly)

      // Boolean Types
      case 'checkbox':
        return genCheckboxInput(field, previewOnly)

      default:
        return ''
    }
  })
  return formFieldChunks
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
          components.push('NRadioGroup', 'NRadio')
          break
        case 'button-group':
          components.push('NButtonGroup')
          break
      }
    }
  })

  const importString = `import {NForm, NFormItem, NButton, NTooltip, ${components.join(', ')}} from 'naive-ui'`
  const componentString = `components: { NForm, NFormItem, NButton, NTooltip, ${components.join(', ')} }`

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
        ${formFields
          .filter((field) => field.isMultiple)
          .map(
            (field) =>
              `${field.key}Options: [${field.options.map((opt) => `{ label: '${opt.label}', value: '${opt.value}' }`).join(', ')}]`,
          )
          .join(',\n          ')}
        ${formFields.some((field) => field.isMultiple) ? `,` : ``}

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

function genMultiSelect(field, previewOnly) {
  switch (field.multiSelectType) {
    case 'select':
      return `<n-form-item path="${field.key}">
  ${generateLabel(field, previewOnly)}
  <n-select v-model:value="formData.${field.key}" :options="${field.key}Options" />
</n-form-item>`

    case 'radio':
      return `<n-form-item path="${field.key}">
  <n-radio-group v-model:value="formData.${field.key}">
    ${generateLabel(field, previewOnly)}
    <n-radio v-for="option in ${field.key}Options" :key="option.value" :value="option.value">
      {{ option.label }}
    </n-radio>
  </n-radio-group>
</n-form-item>`

    case 'button-group':
      return `<n-form-item path="${field.key}">
  <n-button-group v-model:value="formData.${field.key}">
    ${generateLabel(field, previewOnly)}
    <n-button v-for="option in ${field.key}Options" :key="option.value" :value="option.value">
      {{ option.label }}
    </n-button>
  </n-button-group>
</n-form-item>`
  }
}

function genTextInput(field, previewOnly) {
  return `<n-form-item path="${field.key}">
  ${generateLabel(field, previewOnly)}
  <n-input v-model:value="formData.${field.key}"  />
</n-form-item>`
}

function genEmailInput(field, previewOnly) {
  return `
<n-form-item path="${field.key}">
  ${generateLabel(field, previewOnly)}
  <n-input v-model:value="formData.${field.key}" type="email" />
</n-form-item>`
}

function genUrlInput(field, previewOnly) {
  return `
<n-form-item path="${field.key}">
  ${generateLabel(field, previewOnly)}
  <n-input v-model:value="formData.${field.key}" type="url" />
</n-form-item>`
}

function genAddressInput(field, previewOnly) {
  return `
<n-form-item path="${field.key}">
  ${generateLabel(field, previewOnly)}
  <n-input v-model:value="formData.${field.key}" />
</n-form-item>`
}

function genPhoneInput(field, previewOnly) {
  return `
<n-form-item path="${field.key}">
  ${generateLabel(field, previewOnly)}
  <n-input v-model:value="formData.${field.key}" type="tel" />
</n-form-item>`
}

function genDateInput(field, previewOnly) {
  return `
<n-form-item path="${field.key}">
  ${generateLabel(field, previewOnly)}
  <n-date-picker v-model:value="formData.${field.key}" />
</n-form-item>`
}

function genNumberInput(field, previewOnly) {
  return `
<n-form-item path="${field.key}">
  ${generateLabel(field, previewOnly)}
  <n-input-number v-model:value="formData.${field.key}" />
</n-form-item>`
}

function genCheckboxInput(field, previewOnly) {
  return `
<n-form-item path="${field.key}">
  ${generateLabel(field, previewOnly)}
  <n-checkbox v-model:value="formData.${field.key}" />
</n-form-item>`
}

// Univeral Helpers
function generateLabel(field, previewOnly) {
  if (previewOnly) {
    return field.label
  }
  return `<template #label>
            ${field.label} ${generateHelperText(field, previewOnly)}
        </template>`
}
function generateHelperText(field, previewOnly) {
  return field.helperText
    ? `
        <n-tooltip trigger="hover">
            <template #trigger>
              <span style="cursor: pointer; margin-left: 4px;">&#9432;</span>
            </template>
            ${field.helperText}
          </n-tooltip>
      `
    : ''
}
