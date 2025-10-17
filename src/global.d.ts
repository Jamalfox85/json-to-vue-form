import type { MessageApi } from 'naive-ui' // or the type from your UI lib

declare global {
  interface Window {
    $message: MessageApi
  }
}

export {}
