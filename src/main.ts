import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

app.config.warnHandler = (msg, instance, trace) => {
  if (
    msg.includes('Property undefined was accessed during render but is not defined on instance.')
  ) {
    return // 🚫 ignore
  }
  console.warn(`[Vue warn]: ${msg}${trace}`)
}

app.mount('#app')
