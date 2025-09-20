<template lang="">
  <div class="preview-code-pane">
    <div class="code-header">
      <button class="copy-btn" @click="copyCode">📋</button>
    </div>
    <pre v-if="content"><code ref="codeBlock" class="language-html">{{ content }}</code></pre>
  </div>
</template>
<script>
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css' // pick a theme you like
export default {
  props: ['content'],
  methods: {
    highlightCode() {
      this.$nextTick(() => {
        if (this.codeBlock) {
          delete this.codeBlock.dataset.highlighted
          hljs.highlightElement(this.codeBlock)
        }
      })
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
  .code-header {
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
</style>
