<template>
  <n-button
    :type="market.live2d.isYapping ? 'success' : 'default'"
    round
    size="small"
    :disabled="!market.live2d.canYap"
    @click="market.live2d.isYapping = !market.live2d.isYapping"
    class="yapButton"
  >
    <n-icon size="18" style="position:relative; top:1px; margin-right: 5px;">
      <Volume />
    </n-icon>
    Yap mode
  </n-button>
</template>

<script setup lang="ts">

import { useMarket } from '@/stores/market'
import { watch } from 'vue'
import { Volume } from '@vicons/tabler'
import { NIcon, NButton } from 'naive-ui'

const market = useMarket()

// if can't yap ( aim/cover/cutscene ) , disable the yapper + disable it on character change
watch(() => market.live2d.canYap, (value) => {
  if (!value) {
    market.live2d.isYapping = false
  }
})

</script>

<style scoped lang="less">
.yapButton {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 10px !important;
}
</style>