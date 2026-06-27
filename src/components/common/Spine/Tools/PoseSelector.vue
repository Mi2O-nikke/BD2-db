<template>
  <div class="poseButtonGroup">
    <n-button
      v-for="pose in poses"
      :key="pose.value"
      :type="market.live2d.current_pose === pose.value ? 'success' : 'default'"
      :disabled="!poseAvailability[pose.value]"
      ghost
      round
      size="small"
      @click="market.live2d.current_pose = pose.value"
      class="poseButton"
    >
      <component :is="pose.label" />
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { useMarket } from '@/stores/market'
import { NIcon, NButton } from 'naive-ui'
import { AimOutlined } from '@vicons/antd'
import { AccessibilityTwotone } from '@vicons/material'
import { h, ref, watch } from 'vue'
import ManageProtection from '@vicons/carbon/ManageProtection'
import { globalParams } from '@/utils/enum/globalParams'
import { charactersWithoutAimAndCover } from '@/utils/json/l2d.js'

const market = useMarket()

const poseAvailability = ref({
  aim: true,
  cover: true,
  fb: true
})

const poses = [
  {
    value: 'aim',
    label: h('div', {
    }, [
      h(NIcon, {
        component: AimOutlined,
        size: 18,
        style: 'position:relative; top:3px'
      }),
      ' Aim'
    ])
  },
  {
    value: 'cover',
    label: h('div', {
    }, [
      h(NIcon, {
        component: ManageProtection,
        size: 18,
        style: 'position:relative; top:5px'
      }),
      ' Cover'
    ])
  },
  {
    value: 'fb',
    label: h('div', {
    }, [
      h(NIcon, {
        component: AccessibilityTwotone,
        size: 18,
        style: 'position:relative; top:3px'
      }),
      ' Full Body'
    ])
  }
]

// Characters that don't have aim or cover poses
const checkCharacterHasPose = (pose: 'aim' | 'cover'): boolean => {
  const characterId = market.live2d.current_id
  
  if (pose === 'aim' && charactersWithoutAimAndCover.includes(characterId)) {
    return false
  }
  
  if (pose === 'cover' && charactersWithoutAimAndCover.includes(characterId)) {
    return false
  }
  
  return true
}

// Update availability when character changes
watch(
  () => market.live2d.current_id,
  () => {
    poseAvailability.value = {
      aim: checkCharacterHasPose('aim'),
      cover: checkCharacterHasPose('cover'),
      fb: true // fb is always available
    }
  },
  { immediate: true }
)
</script>

<style scoped lang="less">
.poseButtonGroup {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.poseButton {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 8px !important;
}
</style>
//