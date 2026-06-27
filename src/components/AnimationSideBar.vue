<template>
  <div class="w-full lg:w-64 lg:h-full max-h-dvh lg:max-h-none overflow-hidden lg:overflow-visible bg-gray-800 text-white flex flex-col">
    <div class="px-2 flex flex-col gap-2">
      <div class="pt-2">
        <div class="inline-flex bg-gray-700/70 rounded-md p-1 gap-1">
          <button
            class="px-3 py-1 rounded text-sm transition-colors"
            :class="sidebarTab === 'controls' ? 'bg-gray-600 text-white' : 'text-gray-300 hover:text-white'"
            @click="sidebarTab = 'controls'"
          >
            Controls
          </button>
          <button
            class="px-3 py-1 rounded text-sm transition-colors"
            :class="sidebarTab === 'layers' ? 'bg-gray-600 text-white' : 'text-gray-300 hover:text-white'"
            @click="sidebarTab = 'layers'"
          >
            Layers
          </button>
        </div>
      </div>
      <template v-if="sidebarTab === 'controls'">
      </template>
      <template v-else>
        <span>Layers</span>
        <input
          v-model="layerFilter"
          type="text"
          placeholder="Filter layers..."
          class="bg-gray-700 text-white rounded px-2 py-1 text-sm"
        />
        <div class="overflow-y-auto sidebar-scroll flex-1 min-h-0">
          <div v-if="!filteredLayers.length" class="text-sm text-gray-400 px-2 py-2">
            No layers found.
          </div>
          <label
            v-for="layer in filteredLayers"
            :key="layer.key"
            class="flex items-center gap-2 py-1 px-2 rounded cursor-pointer hover:bg-gray-700"
          >
            <input
              type="checkbox"
              :checked="isLayerVisible(layer.key)"
              @change="toggleLayer(layer.key)"
            />
            <span class="truncate" :title="layer.label">{{ layer.label }}</span>
          </label>
        </div>
      </template>
    </div>
    <div class="flex flex-col">
      <div v-if="!currentChar?.customFiles" class="p-2">
        <div class="flex flex-col gap-2">
          <button
            @click="store.animationCategory = 'character'"
            class="w-full py-2 rounded-full flex items-center justify-center font-semibold text-sm transition-all"
            :class="store.animationCategory === 'character' 
              ? 'bg-indigo-600 text-white shadow-lg' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
          >
            Character
          </button>
          <button
            @click="store.animationCategory = 'ultimate'"
            :disabled="!currentChar?.cutscene"
            class="w-full py-2 rounded-full flex items-center justify-center font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            :class="store.animationCategory === 'ultimate' 
              ? 'bg-indigo-600 text-white shadow-lg' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:hover:bg-gray-700'"
          >
            Ultimate
          </button>
          <button
            @click="store.animationCategory = 'dating'"
            :disabled="!currentChar?.dating"
            class="w-full py-2 rounded-full flex items-center justify-center font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            :class="store.animationCategory === 'dating' 
              ? 'bg-indigo-600 text-white shadow-lg' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:hover:bg-gray-700'"
          >
            Fated Guest
          </button>
        </div>
        <div class="border-t border-gray-600 my-2"></div>
        <button
          @click="yappingMode = !yappingMode"
          :disabled="!hasYappingAnimation"
          class="w-full py-2 rounded-full flex items-center justify-center font-semibold text-sm transition-all"
          :class="{
            'disabled:opacity-50 disabled:cursor-not-allowed': !hasYappingAnimation,
            'bg-pink-600 text-white shadow-lg': yappingMode && hasYappingAnimation,
            'bg-gray-700 text-gray-300 hover:bg-gray-600': !yappingMode && hasYappingAnimation,
            'bg-gray-700 text-gray-400 opacity-50 cursor-not-allowed': !hasYappingAnimation
          }"
        >
          Yapping Mode
        </button>
        <div :style="{ marginTop: yappingToHitAreaGap + 'px' }" class="flex flex-col gap-0">
          <button
            @click="hitAreaVisible = !hitAreaVisible"
            :disabled="!canTriggerHitAreas"
            class="w-full py-2 rounded-full flex items-center justify-center font-semibold text-sm transition-all"
            :class="{
              'disabled:opacity-50 disabled:cursor-not-allowed': !canTriggerHitAreas,
              'bg-orange-600 text-white shadow-lg': hitAreaVisible && canTriggerHitAreas,
              'bg-gray-700 text-gray-300 hover:bg-gray-600': !hitAreaVisible && canTriggerHitAreas,
              'bg-gray-700 text-gray-400 opacity-50 cursor-not-allowed': !canTriggerHitAreas
            }"
          >
            Hit Area
          </button>
        <div v-if="showSlider" :style="{ marginTop: hitAreaToSliderGap + 'px' }" class="rounded-full relative border-none shadow-none overflow-hidden" :class="{ 'opacity-50 pointer-events-none': !canTriggerHitAreas }">
            <div class="relative h-10 flex items-center shadow-none overflow-hidden">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-white transition-opacity duration-200 pointer-events-none z-30"
                :style="{
                  opacity: Math.max(0, (hitAreaScale - 0) * 2)
                }">
                Night Mood
              </span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                v-model.number="hitAreaScale"
                @change="onSliderChange"
                @pointerup="onSliderChange"
                :disabled="!canTriggerHitAreas"
                class="w-full h-10 appearance-none bg-gray-600 rounded-full cursor-pointer slider-thick outline-none border-none relative z-20 disabled:opacity-50 disabled:cursor-not-allowed"
                :style="{ '--slider-color': hitAreaScale < 0.5 ? '#fbbf24' : '#a78bfa' }"
              />
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-white transition-opacity duration-200 pointer-events-none z-30"
                :style="{
                  opacity: Math.max(0, 1 - hitAreaScale * 2)
                }">
                Morning Mood
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="p-2 flex flex-col gap-2">
        <span>Skins</span>
        <select
          v-model="store.selectedSkin"
          class="bg-gray-700 text-white rounded"
        >
          <option v-for="skin in skins" :key="skin" :value="skin">{{ skin }}</option>
        </select>
        <span>Animations</span>
        <select
          :value="selectedAnimation"
          @change="select(($event.target as HTMLSelectElement).value)"
          class="bg-gray-700 text-white rounded"
        >
          <option value="">Select an animation...</option>
          <option v-for="name in animations" :key="name" :value="name">{{ name }}</option>
        </select>
      </div>
      <div :style="{ marginTop: sliderToAnimSpeedGap + 'px' }" class="p-2">
        <span>Animation Speed</span>
        <div class="flex items-center gap-2">
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.05"
            v-model.number="store.animationSpeed"
            class="flex-1"
          />
          <span class="w-12 text-right">{{ store.animationSpeed.toFixed(2) }}x</span>
        </div>
      </div>
      <div class="p-2 gap-2 hidden lg:flex">
        <button
          class="bg-gray-600 hover:bg-gray-500 text-white rounded shadow transition px-4 py-2"
          @click="emit('reset-camera')"
        >
          Reset (z)
        </button>
        <button
          class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded shadow transition px-4 py-2"
          @click="store.playing = !store.playing"
        >
          {{ toggleLabel }}
        </button>
      </div>
      <div class="p-2 flex">
        <button
          class="flex-1 bg-gray-600 hover:bg-gray-500 text-white rounded shadow transition px-4 py-2"
          @click="colorInput?.click()"
        >
          BG Color
        </button>
        <input
          ref="colorInput"
          type="color"
          class="hidden"
          @input="onColorChange"
        />
      </div>
      <div class="p-2 flex gap-2 items-center">
        <button
          class="flex-1 bg-gray-600 hover:bg-gray-500 text-white rounded shadow transition px-4 py-2"
          @click="onScreenshot"
          :disabled="screenshotting"
        >
          <LoadingIcon v-if="screenshotting" />
          <span v-else>Screenshot</span>
        </button>
        <label class="flex items-center gap-1 text-sm whitespace-nowrap">
          <input type="checkbox" v-model="transparentBg" />
          <span>Transparent<br />image/export</span>
        </label>
      </div>
      <div class="p-2 hidden md:flex relative" ref="desktopExportRef">
        <button
          class="flex-1 bg-gray-600 hover:bg-gray-500 text-white rounded shadow transition px-4 py-2"
          @click="showExportMenu = !showExportMenu"
          :disabled="exporting"
        >
          <LoadingIcon v-if="exporting" />
          <span v-else>Export Animation</span>
        </button>
        <div
          v-if="showExportMenu"
          class="absolute right-2 bottom-full mb-1 w-48 bg-gray-700 rounded shadow z-10"
        >
          <button
            class="block w-full text-left px-4 py-2 hover:bg-gray-600"
            @click="onExport('video')"
          >
            Export as WebM
          </button>
          <button
            class="block w-full text-left px-4 py-2 hover:bg-gray-600"
            @click="onExport('frames')"
          >
            Export as Frames (ZIP)
          </button>
        </div>
      </div>
      <div class="p-2 flex md:hidden relative" ref="mobileExportRef">
        <button
          class="flex-1 bg-gray-600 hover:bg-gray-500 text-white rounded shadow transition px-4 py-2"
          @click="showExportMenu = !showExportMenu"
          :disabled="exporting"
        >
          <LoadingIcon v-if="exporting" />
          <span v-else>Export Animation</span>
        </button>
        <div
          v-if="showExportMenu"
          class="absolute right-2 top-full mt-1 w-48 bg-gray-700 rounded shadow z-10"
        >
          <button
            class="block w-full text-left px-4 py-2 hover:bg-gray-600"
            @click="onExport('video')"
          >
            Export as WebM
          </button>
          <button
            class="block w-full text-left px-4 py-2 hover:bg-gray-600"
            @click="onExport('frames')"
          >
            Export as Frames (ZIP)
          </button>
        </div>
      </div>
      <div class="p-2">
        <label class="flex items-center gap-1 text-sm whitespace-nowrap">
          <input type="checkbox" v-model="store.useCurrentCamera" />
          <span>Use current camera in image/export</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs, ref, watch, onMounted, onUnmounted } from 'vue'
import { useCharacterStore } from '@/stores/characterStore'
import hitAreaConfig from '@/utils/hitAreaConfig'

import LoadingIcon from '@/components/icons/LoadingIcon.vue';

const props = defineProps<{ animations: string[]; skins: string[]; exporting: boolean; screenshotting: boolean }>()
const { animations, skins, exporting, screenshotting } = toRefs(props)

const store = useCharacterStore()
const colorInput = ref<HTMLInputElement | null>(null)
const transparentBg = ref(false)
const showExportMenu = ref(false)
const desktopExportRef = ref<HTMLElement | null>(null)
const mobileExportRef = ref<HTMLElement | null>(null)
const sidebarTab = ref<'controls' | 'layers'>('controls')
const layerFilter = ref('')
const yappingMode = ref(false)
const hitAreaVisible = ref(false)
const hitAreaScale = ref(0)
const yappingToHitAreaGap = ref(8)
const hitAreaToSliderGap = ref(8)
const sliderToAnimSpeedGap = ref(12)

function onSliderChange() {
  // Always emit mood-changed, then snap to nearest position
  if (hitAreaScale.value >= 0.5) {
    hitAreaScale.value = 1
    // Emit event for Morning Mood (idle2)
    emit('mood-changed', { mood: 'morning', animation: 'idle2' })
  } else {
    hitAreaScale.value = 0
    // Emit event for Night Mood (idle1)
    emit('mood-changed', { mood: 'night', animation: 'idle1' })
  }
}

watch(yappingMode, (enabled) => {
  if (enabled) {
    // Find idle animation
    const idleAnim = animations.value.find(anim => anim.toLowerCase().includes('idle'))
    // Find the _face0_talk animation
    const talkAnim = animations.value.find(anim => anim.includes('_face0_talk'))
    
    console.log('Yapping mode toggled ON', { idleAnim, talkAnim })
    
    if (idleAnim && talkAnim) {
      // Emit event to play both animations
      emit('yapping-mode', { enabled: true, idleAnim, talkAnim })
    } else {
      console.warn('Missing animations for yapping mode', { idleAnim, talkAnim, availableAnims: animations.value })
    }
  } else {
    console.log('Yapping mode toggled OFF')
    emit('yapping-mode', { enabled: false })
  }
})

watch(hitAreaVisible, (visible) => {
  try {
    emit('hit-area-toggle', visible)
  } catch (error) {
    console.error('Error toggling hit area:', error)
    hitAreaVisible.value = false
  }
})

const emit = defineEmits(['select', 'reset-camera', 'screenshot', 'export-animation', 'category-change', 'yapping-mode', 'hit-area-toggle', 'mood-changed'])

function select(name: string) {
  emit('select', name)
  store.selectedAnimation = name
}

function onColorChange(e: Event) {
  const input = e.target as HTMLInputElement
  store.backgroundColor = input.value
}

function onScreenshot() {
  emit('screenshot', transparentBg.value)
}

function onExport(format: 'video' | 'frames') {
  emit('export-animation', { format, transparent: transparentBg.value })
  showExportMenu.value = false
}

function handleClickOutside(e: MouseEvent) {
  const target = e.target as Node
  if (desktopExportRef.value?.contains(target) || mobileExportRef.value?.contains(target))
    return
  showExportMenu.value = false
}

const selectedAnimation = computed(() => store.selectedAnimation)
const toggleLabel = computed(() => (store.playing ? 'Pause' : 'Play'))
const currentChar = computed(() => store.characters.find(c => c.id === store.selectedCharacterId))
const layerSourceSeparator = ' > '
const hasYappingAnimation = computed(() => {
  const result = animations.value.some(anim => anim.includes('_face0_talk'))
  return result
})
const hasHitAreas = computed(() => {
  // Show hit area button in all categories, but only functional in dating
  const charId = store.selectedCharacterId
  return !!hitAreaConfig[charId]
})

const showSlider = computed(() => {
  // Slider is always shown for all characters
  return true
})

const canTriggerHitAreas = computed(() => {
  // Hit areas can only be triggered in Fated Guests (dating) category
  return store.animationCategory === 'dating' && hasHitAreas.value
})
const layerNames = computed(() => [...store.layerNames].sort((a, b) => a.localeCompare(b)))
const layerItems = computed(() => {
  const baseCounts = new Map<string, number>()
  layerNames.value.forEach(name => {
    const baseName = getLayerBaseName(name)
    baseCounts.set(baseName, (baseCounts.get(baseName) ?? 0) + 1)
  })

  const seenDuplicates = new Map<string, number>()
  return layerNames.value.map(name => {
    const baseName = getLayerBaseName(name)
    const duplicateCount = baseCounts.get(baseName) ?? 0
    if (duplicateCount <= 1) {
      return { key: name, label: baseName }
    }

    const seen = seenDuplicates.get(baseName) ?? 0
    seenDuplicates.set(baseName, seen + 1)
    return {
      key: name,
      label: seen === 0 ? baseName : `${baseName} (${seen === 1 ? 'extra' : `extra ${seen}`})`,
    }
  })
})
const filteredLayers = computed(() => {
  const query = layerFilter.value.trim().toLowerCase()
  if (!query) return layerItems.value
  return layerItems.value.filter(layer =>
    layer.key.toLowerCase().includes(query) || layer.label.toLowerCase().includes(query),
  )
})

function getLayerBaseName(name: string) {
  const separatorIndex = name.indexOf(layerSourceSeparator)
  if (separatorIndex === -1) return name
  return name.slice(separatorIndex + layerSourceSeparator.length)
}

function isLayerVisible(name: string) {
  const value = store.layerVisibility[name]
  return value !== false
}

function toggleLayer(name: string) {
  store.layerVisibility[name] = !isLayerVisible(name)
}

watch(() => store.animationCategory, () => {
  emit('category-change');
  
  // Auto-toggle hit area button twice when entering Fated Guests mode
  if (store.animationCategory === 'dating' && hasHitAreas.value) {
    // First click - open
    hitAreaVisible.value = true
    
    // Second click - close (after a brief delay)
    setTimeout(() => {
      hitAreaVisible.value = false
    }, 500)
  }
});

watch(() => store.selectedCharacterId, () => {
  // Reset slider to 0 (Night Mood) when character changes
  hitAreaScale.value = 0
  // Reset yapping mode when character changes
  yappingMode.value = false
});

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  
  // Auto-toggle hit area button twice if already in Fated Guests mode on mount
  if (store.animationCategory === 'dating' && hasHitAreas.value) {
    // First click - open
    hitAreaVisible.value = true
    
    // Second click - close (after a brief delay)
    setTimeout(() => {
      hitAreaVisible.value = false
    }, 500)
  }
})
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
.slider-thick {
  -webkit-appearance: none;
  outline: none;
  border: none;
}

.slider-thick:focus {
  outline: none;
  border: none;
}

.slider-thick::-webkit-slider-runnable-track {
  background: linear-gradient(to right, #6b5b95 0%, #4b5563 50%, #d4a574 100%);
  height: 40px;
  border-radius: 20px;
  outline: none;
  border: none;
  box-shadow: none;
}

.slider-thick::-webkit-slider-thumb {
  appearance: none;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--slider-color, #a78bfa) 0%, color-mix(in srgb, var(--slider-color, #a78bfa) 80%, #000) 100%);
  cursor: pointer;
  box-shadow: 0 0 16px rgba(167, 139, 250, 0.9), inset -2px -2px 8px rgba(0, 0, 0, 0.3);
  outline: none;
  border: 3px solid rgba(255, 255, 255, 0.3);
  transition: background 0.3s ease;
}

.slider-thick::-moz-range-track {
  background: linear-gradient(to right, #6b5b95 0%, #4b5563 50%, #d4a574 100%);
  height: 40px;
  border-radius: 20px;
  border: none;
  outline: none;
  box-shadow: none;
}

.slider-thick::-moz-range-progress {
  background: #4b5563;
  height: 40px;
  border-radius: 20px;
}

.slider-thick::-moz-range-thumb {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--slider-color, #a78bfa) 0%, color-mix(in srgb, var(--slider-color, #a78bfa) 80%, #000) 100%);
  cursor: pointer;
  border: 3px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 0 16px rgba(167, 139, 250, 0.9), inset -2px -2px 8px rgba(0, 0, 0, 0.3);
  outline: none;
  transition: background 0.3s ease;
}
</style>
