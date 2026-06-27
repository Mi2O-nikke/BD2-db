<template>
  <n-button ghost type="success" round @click="hideUI()">Hide UI ⎵</n-button>
</template>

<script setup lang="ts">
import { useMarket } from '@/stores/market'
import { messagesEnum } from '@/utils/enum/globalParams'

const market = useMarket()

const hideUI = () => {
  market.live2d.triggerHideUI()
  market.message.getMessage().success(messagesEnum.MESSAGE_UI_SHOWBACK, market.message.long_message)
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    // Check if the user is typing in an input field
    const target = e.target as HTMLElement
    const isInputField = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'
    
    if (!isInputField) {
      e.preventDefault()
      if (market.live2d.hideUI) {
        market.live2d.triggerShowUI()
      } else {
        market.live2d.triggerHideUI()
        market.message.getMessage().success(messagesEnum.MESSAGE_UI_SHOWBACK, market.message.long_message)
      }
    }
  }
})
</script>

<style scoped lang="less">
.n-button {
  width: 100%;
  height: 40px;
}
</style>
