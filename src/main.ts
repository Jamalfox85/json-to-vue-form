import { createApp } from 'vue'
import App from './App.vue'

/* Font Awesome */
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
library.add(fas)
library.add(far)

/* Naive UI */
import { createDiscreteApi } from 'naive-ui'
const { message, dialog } = createDiscreteApi(['message', 'dialog'])
window.$message = message

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)

app.config.warnHandler = (msg, instance, trace) => {
  if (
    msg.includes('Property undefined was accessed during render but is not defined on instance.')
  ) {
    return // 🚫 ignore
  }
  console.warn(`[Vue warn]: ${msg}${trace}`)
}

app.mount('#app')
