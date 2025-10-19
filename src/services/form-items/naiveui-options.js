export default function generateComponent(formFields) {
  const formFieldChunks = generateFormFieldChunks(formFields)
  const formFieldChunksPreviewOnly = generateFormFieldChunks(formFields, true)

  const exportTemplate = `<template>
${indent(1)}<n-form ref="formRef" @submit.prevent="handleSubmit" :model="formData" :rules="rules">
${formFieldChunks
  .map((c) => {
    if (!c) return ''
    return indent(2) + c.trimStart()
  })
  .join('\n')}
${indent(2)}<n-form-item>
${indent(3)}<n-button type="primary" @click="handleSubmit">Submit</n-button>
${indent(2)}</n-form-item>
${indent(1)}</n-form>
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

  let optionsScript = generateComponentScriptOptions(formFields)
  let compositionScript = generateComponentScriptComposition(formFields)

  return {
    exportOptionsCode: exportTemplate + optionsScript,
    exportCompositionCode: exportTemplate + compositionScript,
    previewCode: previewTemplate + optionsScript,
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
      case 'password':
        return genPasswordInput(field, previewOnly)

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

function generateComponentScriptOptions(formFields) {
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

  const importString = `import {NForm, NFormItem, NButton, NTooltip, ${components.join(
    ', ',
  )}} from 'naive-ui'`
  const componentString = `components: { NForm, NFormItem, NButton, NTooltip, ${components.join(
    ', ',
  )} }`

  let numRules = 0
  const rulesString = `rules: {
${
  formFields
    .map((field) => {
      if (!field.required) return ''
      numRules++
      return `${indent(4)}${field.key}: [
${indent(5)}{
${indent(6)}required: ${field.required},
${indent(6)}message: '${field.label} is required',
${indent(6)}trigger: ['input', 'submit'],
${indent(5)}},
${indent(4)}]`
    })
    .filter(Boolean)
    .join(',\n') + '\n'
}
${indent(3)}}
  `
  const dataString = `data() {
${indent(2)}return {
${indent(3)}formRef: null,
${indent(3)}formData: {
${
  formFields.some((f) => f.active)
    ? formFields
        .filter((field) => field.active)
        .map((field) => `${indent(4)}${field.key}: null`)
        .join(',\n') + '\n'
    : ''
}${indent(3)}},
${
  formFields.some((f) => f.isMultiple)
    ? formFields
        .filter((field) => field.isMultiple)
        .map(
          (field) =>
            `${indent(3)}${field.key}Options: [${field.options
              .map((opt) => `{ label: '${opt.label}', value: '${opt.value}' }`)
              .join(', ')}]`,
        )
        .join(',\n') + ',\n'
    : ''
}${`${indent(3)}${rulesString.trimStart()}`}
${indent(2)}}
${indent(1)}}`
  const methodsString = `methods: {
${indent(2)}handleSubmit() {
${indent(3)}this.$refs.formRef.validate((errors) => {
${indent(4)}if (!errors) {
${indent(5)}console.log("✅ Submit:", this.formData);
${indent(4)}} else {
${indent(5)}console.log("❌ Validation failed:", errors);
${indent(4)}}
${indent(3)}});
${indent(2)}},
${indent(1)}}`

  return `<script>
${importString}

export default {
${indent(1)}${componentString},
${indent(1)}${dataString},
${indent(1)}${methodsString}
}
</script>`
}

function generateComponentScriptComposition(formFields) {
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

  const importString = `import { NForm, NFormItem, NButton, NTooltip, ${components.join(
    ', ',
  )} } from 'naive-ui'
import { ref, reactive } from 'vue'`

  // ---- Rules ----
  const rulesString = formFields
    .filter((field) => field.required)
    .map(
      (field) => `${indent(2)}${field.key}: [
${indent(3)}{
${indent(4)}required: true,
${indent(4)}message: '${field.label} is required',
${indent(4)}trigger: ['input', 'submit'],
${indent(3)}},
${indent(2)}]`,
    )
    .join(',\n')

  const hasRules = formFields.some((f) => f.required)
  const rulesBlock = hasRules ? `const rules = {\n${rulesString}\n}` : `const rules = {}`

  // ---- formData ----
  const formDataString = formFields
    .filter((field) => field.active)
    .map((field) => `${indent(2)}${field.key}: null`)
    .join(',\n')

  // ---- options arrays ----
  const optionsFields = formFields
    .filter((f) => f.isMultiple)
    .map(
      (field) =>
        `const ${field.key}Options = ref([${field.options
          .map((opt) => `{ label: '${opt.label}', value: '${opt.value}' }`)
          .join(', ')}])`,
    )
    .join('\n')

  // ---- submit function ----
  const handleSubmitString = `function handleSubmit() {
${indent(1)}formRef.value?.validate((errors) => {
${indent(2)}if (!errors) {
${indent(3)}console.log("✅ Submit:", formData)
${indent(2)}} else {
${indent(3)}console.log("❌ Validation failed:", errors)
${indent(2)}}
${indent(1)}})
}`

  // ---- final template ----
  return `<script setup>
${importString}

const formRef = ref(null)
const formData = reactive({
${formDataString ? formDataString + '\n' : ''}})

${rulesBlock}

${optionsFields ? '\n' + optionsFields + '\n' : ''}

${handleSubmitString}
</script>`
}

function genMultiSelect(field, previewOnly) {
  switch (field.multiSelectType) {
    case 'select':
      return `${indent(2)}<n-form-item path="${field.key}">
${indent(3)}${generateLabel(field, previewOnly)}
${indent(3)}<n-select v-model:value="formData.${field.key}" :options="${field.key}Options" />
${indent(2)}</n-form-item>`

    case 'radio':
      return `${indent(2)}<n-form-item path="${field.key}">
${indent(3)}<n-radio-group v-model:value="formData.${field.key}">
${indent(4)}${generateLabel(field, previewOnly)}
${indent(4)}<n-radio v-for="option in ${
        field.key
      }Options" :key="option.value" :value="option.value">
${indent(5)}{{ option.label }}
${indent(4)}</n-radio>
${indent(3)}</n-radio-group>
${indent(2)}</n-form-item>`

    case 'button-group':
      return `${indent(2)}<n-form-item path="${field.key}">
${indent(3)}<n-button-group v-model:value="formData.${field.key}">
${indent(4)}${generateLabel(field, previewOnly)}
${indent(4)}<n-button v-for="option in ${
        field.key
      }Options" :key="option.value" :value="option.value">
${indent(5)}{{ option.label }}
${indent(4)}</n-button>
${indent(3)}</n-button-group>
${indent(2)}</n-form-item>`
  }
}

function genTextInput(field, previewOnly) {
  return `${indent(2)}<n-form-item path="${field.key}">
${indent(3)}${generateLabel(field, previewOnly)}
${indent(3)}<n-input v-model:value="formData.${field.key}"  />
${indent(2)}</n-form-item>`
}

function genEmailInput(field, previewOnly) {
  return `${indent(2)}<n-form-item path="${field.key}">
${indent(3)}${generateLabel(field, previewOnly)}
${indent(3)}<n-input v-model:value="formData.${field.key}" type="email" />
${indent(2)}</n-form-item>`
}

function genUrlInput(field, previewOnly) {
  return `${indent(2)}<n-form-item path="${field.key}">
${indent(3)}${generateLabel(field, previewOnly)}
${indent(3)}<n-input v-model:value="formData.${field.key}" type="url" />
${indent(2)}</n-form-item>`
}

function genAddressInput(field, previewOnly) {
  return `${indent(2)}<n-form-item path="${field.key}">
${indent(3)}${generateLabel(field, previewOnly)}
${indent(3)}<n-input v-model:value="formData.${field.key}" />
${indent(2)}</n-form-item>`
}

function genPhoneInput(field, previewOnly) {
  return `${indent(2)}<n-form-item path="${field.key}">
${indent(3)}${generateLabel(field, previewOnly)}
${indent(3)}<n-input v-model:value="formData.${field.key}" type="tel" />
${indent(2)}</n-form-item>`
}

function genDateInput(field, previewOnly) {
  return `${indent(2)}<n-form-item path="${field.key}">
${indent(3)}${generateLabel(field, previewOnly)}
${indent(3)}<n-date-picker v-model:value="formData.${field.key}" />
${indent(2)}</n-form-item>`
}

function genPasswordInput(field, previewOnly) {
  return `${indent(2)}<n-form-item path="${field.key}">
${indent(3)}${generateLabel(field, previewOnly)}
${indent(3)}<n-input v-model:value="formData.${field.key}" type="password" />
${indent(2)}</n-form-item>`
}

function genNumberInput(field, previewOnly) {
  return `${indent(2)}<n-form-item path="${field.key}">
${indent(3)}${generateLabel(field, previewOnly)}
${indent(3)}<n-input-number v-model:value="formData.${field.key}" />
${indent(2)}</n-form-item>`
}

function genCheckboxInput(field, previewOnly) {
  return `${indent(2)}<n-form-item path="${field.key}">
${indent(3)}${generateLabel(field, previewOnly)}
${indent(3)}<n-checkbox v-model:value="formData.${field.key}" />
${indent(2)}</n-form-item>`
}

// Univeral Helpers
const indent = (level) => '    '.repeat(level)
function generateLabel(field, previewOnly) {
  if (previewOnly) {
    return `<div class="preview-label">${field.label}</div>`
  }
  return `<template #label>${field.label} ${generateHelperText(field)}</template>`
}
function generateHelperText(field) {
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
