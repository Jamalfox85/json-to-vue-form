<template>
  <div class="app_wrapper" @mousemove="updatePosition">
    <div
      class="mouse-glow"
      :style="{
        left: `${mousePosition.x}px`,
        top: `${mousePosition.y}px`,
      }"
    ></div>
    <div class="header glass-bg">
      <h1 class="primary-header">JSON to Vue Form</h1>
      <div class="header-right">
        <div class="help-icon" @click="showModal = true">
          <font-awesome-icon icon="fa-solid fa-question" />
        </div>
      </div>
      <n-modal v-model:show="showModal" class="glass-modal">
        <n-card
          title="Build Forms from JSON"
          size="huge"
          role="dialog"
          aria-modal="true"
          :bordered="false"
          class="glass-card"
        >
          <template #header-extra>
            <font-awesome-icon
              icon="fa-solid fa-xmark"
              @click="showModal = false"
              style="cursor: pointer"
            />
          </template>
          <div class="modal-content">
            <p>
              JSON to Vue lets you turn your JSON data structure into a fully functional Vue form in
              just a few steps. Enter your desired JSON format, configure your inputs, and export
              ready-to-use Vue code.
            </p>
            <div class="steps-container">
              <div class="step">
                <h3>1. Enter your target JSON</h3>
                <p>Provide the JSON structure that your form should submit.</p>
                <div class="image-wrapper">
                  <img src="@/assets/images/step-1.png" alt="JSON Input Example" />
                </div>
                <i> "I want a sign up form that submits data in this format..." </i>
              </div>
              <div class="step">
                <h3>2. Configure your fields</h3>
                <p>Set labels, input types, validation rules, and which fields are required.</p>
                <div class="image-wrapper">
                  <img src="@/assets/images/step-2.png" alt="JSON Input Example" />
                </div>
                <i>"A user must provide their email address."</i>
              </div>
              <div class="step">
                <h3>3. Preview & export</h3>
                <p>
                  Check that the generated form matches your expectations, then copy the Vue
                  component code into your project.
                </p>
                <div class="image-wrapper">
                  <img src="@/assets/images/step-3.png" alt="JSON Input Example" />
                </div>
                <i>"Looks good! Ready to copy my form."</i>
              </div>
            </div>
          </div>
        </n-card>
      </n-modal>
    </div>
    <div class="main">
      <div class="col-block">
        <div class="col-block-inside-block glass-bg">
          <div class="block-wrapper">
            <h2>Form Templates</h2>
            <p>Choose a starting template</p>
            <div class="filters">
              <div>
                <n-button @click="setTemplate('signUp')">Sign Up</n-button>
                <n-button @click="setTemplate('login')">Login</n-button>
                <n-button @click="setTemplate('payment')">Payment</n-button>
              </div>
              <div>
                <n-button @click="setTemplate('checkout')">Checkout</n-button>
                <n-button @click="setTemplate('contact')">Contact</n-button>
              </div>
            </div>
          </div>
        </div>
        <div class="col-block-inside-block glass-bg">
          <JSONInputBlock :templateInput="templateInput" @jsonInput="handleJsonInput" />
        </div>
      </div>
      <div class="col-block glass-bg" :class="{ disabled: !parsedJSON }">
        <FormRulesBlock
          :templateJSON="templateJSON"
          :parsedJSON="parsedJSON"
          @settingsUpdate="handleSettingsUpdate"
        />
      </div>
      <div class="col-block glass-bg" :class="{ disabled: !parsedJSON }">
        <CodeOutputBlock :formFieldSettings="formFieldSettings" />
      </div>
    </div>
  </div>
</template>

<script>
import JSONInputBlock from './components/JSONInputBlock.vue'
import FormRulesBlock from './components/FormRulesBlock.vue'
import CodeOutputBlock from './components/CodeOutputBlock.vue'

import { NButton, NModal, NCard } from 'naive-ui'
import * as templates from './form-templates'

export default {
  components: {
    JSONInputBlock,
    FormRulesBlock,
    CodeOutputBlock,
    NButton,
    NModal,
    NCard,
  },
  data() {
    return {
      mousePosition: { x: 0, y: 0 },
      templateInput: '',
      jsonInput: '',
      parsedJSON: null,
      templateJSON: null,
      formFieldSettings: [],
      showModal: false,
    }
  },
  methods: {
    handleJsonInput(json) {
      this.jsonInput = json
      this.parseJSONFields(json)
    },
    parseJSONFields(json) {
      try {
        this.parsedJSON = JSON.parse(json)
      } catch (e) {
        console.error('Invalid JSON:', e)
      }
    },
    handleSettingsUpdate(updatedSettings) {
      this.formFieldSettings = updatedSettings
    },
    setTemplate(templateName) {
      let template = templates[`${templateName}Template`]
      let templateString = JSON.stringify(template, null, 4)
      this.jsonInput = templateString
      this.templateInput = templateString
      this.templateJSON = templateString
    },
    updatePosition(e) {
      this.mousePosition.x = e.clientX
      this.mousePosition.y = e.clientY
    },
  },
}
</script>

<style lang="scss">
.app_wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a192f, #112a4b);
  color: #fff;
  .mouse-glow {
    position: absolute;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(66, 184, 131, 0.8), transparent 60%);
    filter: blur(100px);
    pointer-events: none;
    transform: translate(-50%, -50%);
    transition:
      left 0.1s ease-out,
      top 0.1s ease-out;
    mix-blend-mode: lighten;
  }
  .glass-bg {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 16px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    transition: all 0.3s ease;
    &:hover {
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
      box-shadow: 0 0 20px rgba(66, 184, 131, 0.5);
    }
  }

  .header {
    padding: 1em;
    margin: 1em;
    display: flex;
    justify-content: space-between;
    .help-icon {
      border-radius: 50%;
      height: 2.5em;
      width: 2.5em;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.3s ease;
      cursor: pointer;
      &:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }
    }
  }

  .main {
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
    flex: 1 1 auto;
    padding: 1em;
    min-height: 0;
    gap: 1em;
    .col-block {
      flex: 1 1 400px;
      min-width: 300px;
      display: flex;
      flex-direction: column;
      min-height: 0;
      &.disabled {
        pointer-events: none;
        opacity: 0.25;
      }
      .col-block-inside-block {
        margin-bottom: 1em;
        flex-grow: 1;
        .filters {
          margin-top: 1em;
          & > * {
            display: flex;
            align-items: center;
            justify-content: space-evenly;
            margin-bottom: 0.5em;
          }
          .n-button {
            margin: 0 0.5rem;
            background: rgba(66, 184, 131, 0.15); /* faint Vue green tint */
            color: #112a4b;
            border-radius: 4px;
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
            cursor: pointer;
            transition: all 0.25s ease;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
          }

          .n-button:hover {
            background: rgba(66, 184, 131, 0.25);
            box-shadow: 0 6px 20px rgba(66, 184, 131, 0.3);
          }
        }
      }
      .block-wrapper {
        flex: 1 1 auto;
        min-height: 0;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    }
  }
}
/* modal overlay background */
.glass-modal :deep(.n-modal-mask) {
  background: rgba(10, 25, 47, 0.6); /* your navy color with transparency */
  backdrop-filter: blur(10px);
}

/* glass card body */
.glass-card {
  width: 75% !important;
  background: rgba(255, 255, 255, 0.4) !important;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 20px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  color: #f5f5f5 !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  padding: 1.5rem;
  transition: all 0.3s ease;
  .n-card-header {
    .n-card-header__main {
      color: #f5f5f5 !important;
      font-size: 2em;
    }
  }
}

.glass-card:hover {
  background: rgba(255, 255, 255, 0.16);
}

/* header text */
.glass-card :deep(.n-card-header) {
  color: #f5f5f5 !important;
  font-weight: 600;
}

.header-extra {
  color: #42b883; /* Vue green accent */
  font-weight: 500;
}

/* modal body */
.modal-content {
  margin: 1rem 0 1.5rem;
  color: #e0e0e0;
  line-height: 1.6;
  .steps-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    gap: 2rem;
    margin-top: 2em;
    .step {
      display: flex;
      flex-direction: column;
      text-align: center;
      width: 300px;
      gap: 0.5em;
      .image-wrapper {
        height: 200px;
        img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
      }
    }
  }
}

/* footer layout */
.footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}
</style>
