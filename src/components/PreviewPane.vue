<template>
  <div class="preview">
    <component :is="dynamicComponent" />
  </div>
</template>

<script>
import * as Vue from 'vue'
import { compile } from '@vue/compiler-dom'
// import the Naive UI components you expect to inject
import {
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NButton,
  NSwitch,
  NSelect,
  NCheckbox,
  NRadioGroup,
  NRadio,
} from 'naive-ui'

export default {
  props: {
    content: { type: String, required: true },
  },
  computed: {
    dynamicComponent() {
      const template = this.extractTemplate(this.content)
      const scriptObj = this.safeExtractScript(this.content)

      // compile template -> render function
      let renderFn
      try {
        const compiled = compile(template, { mode: 'function' }).code
        renderFn = new Function('Vue', `${compiled}; return render`)(Vue)
      } catch (e) {
        console.error('Template compile error:', e)
        renderFn = () => Vue.h('div', 'Template compile error')
      }

      // Inject Naive UI components (override if scriptObj already had components)
      const injectedComponents = {
        NForm,
        NFormItem,
        NInput,
        NInputNumber,
        NButton,
        NSwitch,
        NSelect,
        NCheckbox,
        NRadioGroup,
        NRadio,
      }

      const finalComponent = {
        ...(scriptObj || {}),
        render: renderFn,
        components: {
          // give precedence to injected components, but merge any existing keys
          ...injectedComponents,
          ...(scriptObj && scriptObj.components ? scriptObj.components : {}),
        },
      }

      return finalComponent
    },
  },
  methods: {
    extractTemplate(code) {
      if (!code) return '<div>No template</div>'
      const m = code.match(/<template>([\s\S]*?)<\/template>/)
      return m ? m[1].trim() : '<div>No template</div>'
    },

    // This version strips imports and removes components: { ... } before eval
    safeExtractScript(code) {
      if (!code) return {}

      const m = code.match(/<script>([\s\S]*?)<\/script>/)
      if (!m) return {}

      let scriptContent = m[1]

      // 1) Remove import statements entirely
      scriptContent = scriptContent.replace(/import[\s\S]*?from\s*['"][^'"]+['"];?/g, '')

      // 2) Remove a `components: { ... }` block if present to avoid undefined refs
      //    This is a simple greedy removal for components: { ... }, assumes balanced braces inside
      scriptContent = scriptContent.replace(/components\s*:\s*{[\s\S]*?},?/g, '')

      // 3) Replace `export default` with `return` so the evaluated function returns the object
      scriptContent = scriptContent.replace(/export\s+default/, 'return')

      // Trim whitespace
      scriptContent = scriptContent.trim()

      try {
        // Evaluate the script content in an isolated function scope
        // It should return the component options object
        const result = new Function(scriptContent)()
        return result || {}
      } catch (e) {
        console.error('Script parse error:', e)
        return {}
      }
    },
  },
}
</script>

<style>
.preview {
  border: 1px solid #ccc;
  padding: 1em;
}
</style>
