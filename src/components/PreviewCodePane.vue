<template lang="">
  <div>
    <pre><code ref="codeBlock" class="language-html">{{ content }}</code></pre>
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
  },
  mounted() {
    this.codeBlock = this.$refs.codeBlock

    this.highlightCode()
  },
}
</script>
<style lang=""></style>
