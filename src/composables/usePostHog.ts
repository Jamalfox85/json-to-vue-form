// src/composables/usePostHog.js
import posthog from 'posthog-js'

let initialized = false

export function usePostHog() {
  if (!initialized) {
    posthog.init('phc_tyI6NFSlDC8XIOBy11OVxb84SsRp8TVRcPTyMf09WaP', {
      api_host: 'https://us.i.posthog.com',
      capture_pageview: true, // ensures a pageview is sent on load
      person_profiles: 'always',
    })
    initialized = true
  }

  return { posthog }
}
