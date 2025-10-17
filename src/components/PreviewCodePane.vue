<template lang="">
  <div class="preview-code-pane">
    <div v-if="content">
        <div class="code-block-section">
            <p>Step 1: Install Dependencies</p>
            <div class="section-header">
                <button class="copy-btn" @click="copyPackageCode">📋</button>
            </div>
            <pre><code ref="packageBlock" class="language-html">{{ packageCode }}</code></pre>
         </div>
        <!-- Would love to reuse AceEditor, but that requires a single lang, so doesn't support vue (html, js, and css)-->
         <div class="code-block-section">
            <p>Step 2: Review and Copy Code</p>
            <div class="section-header">
                <button class="copy-btn" @click="copyCode">📋</button>
            </div>
            <pre><code ref="codeBlock" class="language-html">{{ content }}</code></pre>
         </div>
    </div>
  </div>
</template>
<script>
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css' // pick a theme you like
export default {
  props: ['content'],
  data(){
    return {
        packageCode: "npm install naive-ui",
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
    async copyPackageCode() {
      try {
        await navigator.clipboard.writeText(this.packageCode)
        // give user some feedback
        alert('Copied to clipboard ✅')
      } catch (err) {
        console.error('Failed to copy: ', err)
      }
    },
    async copyCode() {
      if (this.content) {
        try {
          await navigator.clipboard.writeText(this.content)
          // give user some feedback
          alert('Copied to clipboard ✅')
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
  .code-block-section {
      margin-bottom: 1.5em;
      .section-header {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 0.5em;
        .copy-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 1.2em;
          color: #fff;
          transition: opacity 0.2s;
          &:hover {
            opacity: 0.7;
          }
        }
      }
  }
}
</style>
