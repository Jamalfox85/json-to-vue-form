<template>
  <div class="block-wrapper">
    <h2>Form Settings</h2>
    <p>Set input rules</p>
    <div class="rules-block">
      <FieldBlock v-for="(field, index) in formFields" :key="index" :formField="field" />
    </div>
  </div>
</template>
<script>
import FieldBlock from './FieldBlock.vue'
export default {
  props: ['formFields'],
  components: {
    FieldBlock,
  },
}
</script>
<style lang="scss">
.rules-block {
  border: solid 2px red;
  width: 450px;
  height: 800px;
  margin-top: 1em;
  display: flex;
  flex-direction: column;
  padding: 1em;
}
</style>
