<template lang="">
  <div class="preview-code-pane">
    <div v-if="content">
      <div class="code-block-section">
        <div class="section-header">
          <p>Step 2: Install Dependencies</p>
          <n-button @click="copyCode(packageCode)"
            ><font-awesome-icon icon="fa-solid fa-copy"
          /></n-button>
        </div>
        <pre><code ref="packageBlock" class="language-html">{{ packageCode }}</code></pre>
      </div>
      <!-- Would love to reuse AceEditor, but that requires a single lang, so doesn't support vue (html, js, and css)-->
      <div class="code-block-section">
        <div class="section-header">
          <p>Step 3: Review and Copy Code</p>
          <n-button @click="copyCode(content)"
            ><font-awesome-icon icon="fa-solid fa-copy"
          /></n-button>
        </div>
        <pre><code ref="codeBlock" class="language-html">{{ content }}</code></pre>
      </div>
    </div>
  </div>
</template>
<script>
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css' // pick a theme you like
import { NButton, NRadioGroup, NRadioButton } from 'naive-ui'
export default {
  props: ['content'],
  components: { NButton, NRadioGroup, NRadioButton },
  data() {
    return {
      packageCode: 'npm install naive-ui',
    }
  },
  methods: {
    highlightCode() {
      this.$nextTick(() => {
        if (this.packageBlock) {
          delete this.packageBlock.dataset.highlighted
          hljs.highlightElement(this.packageBlock)
        }
        if (this.codeBlock) {
          delete this.codeBlock.dataset.highlighted
          hljs.highlightElement(this.codeBlock)
        }
      })
    },
    async copyCode(content) {
      if (content) {
        try {
          await navigator.clipboard.writeText(content)
          window.$message.success('Code copied to clipboard!')
        } catch (err) {
          console.error('Failed to copy: ', err)
        }
      }
    },
  },
  mounted() {
    this.codeBlock = this.$refs.codeBlock
    this.packageBlock = this.$refs.packageBlock

    this.highlightCode()
  },
}
</script>
<style lang="scss">
.preview-code-pane {
  display: flex;
  flex-direction: column;
  height: 600px;
  flex-grow: 1;
  overflow-y: auto;
  padding: 1em;
  color: #f5f5f5;
  .code-block-section {
    margin-bottom: 1.5em;
    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.5em;
      .n-button {
        background: rgba(66, 184, 131, 0.75);
        border-radius: 4px;
        &:hover,
        &:focus {
          color: #fff;
        }
      }
    }
  }
}
</style>
