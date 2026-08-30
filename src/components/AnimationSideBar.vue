<template>
  <div class="w-full lg:w-64 lg:h-full max-h-dvh lg:max-h-none overflow-hidden lg:overflow-visible bg-gray-800 text-white flex flex-col min-h-0">
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
    </div>
    
    <!-- Layers Tab Content -->
    <template v-if="sidebarTab === 'layers'">
      <div class="px-2 flex flex-col gap-2 flex-1 min-h-0">
        <span>Layers</span>
        <input
          v-model="layerFilter"
          type="text"
          placeholder="Filter layers..."
          class="bg-gray-700 text-white rounded px-2 py-1 text-sm"
        />
        <div class="flex gap-2">
          <button
            @click="selectAllLayers"
            class="flex-1 bg-gray-600 hover:bg-gray-500 text-white rounded px-2 py-1 text-sm transition-colors"
          >
            Select All
          </button>
          <button
            @click="deselectAllLayers"
            class="flex-1 bg-gray-600 hover:bg-gray-500 text-white rounded px-2 py-1 text-sm transition-colors"
          >
            Deselect All
          </button>
        </div>
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
      </div>
    </template>
    
    <!-- Controls Tab Content -->
    <template v-else>
      <div class="flex flex-col overflow-y-auto flex-1">
      <div v-if="!currentChar?.customFiles" class="p-2">
        <div class="flex flex-col gap-2">
          <button
            @click="() => { store.animationCategory = 'character'; store.selectedAnimation = '' }"
            class="w-full py-2 rounded-full flex items-center justify-center font-semibold text-sm transition-all"
            :class="store.animationCategory === 'character' 
              ? 'bg-indigo-600 text-white shadow-lg' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
          >
            Character
          </button>
          <button
            @click="() => { store.animationCategory = 'ultimate'; store.selectedAnimation = '' }"
            :disabled="!currentChar?.cutscene"
            class="w-full py-2 rounded-full flex items-center justify-center font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            :class="store.animationCategory === 'ultimate' 
              ? 'bg-indigo-600 text-white shadow-lg' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:hover:bg-gray-700'"
          >
            Ultimate
          </button>
          <button
            @click="() => { store.animationCategory = 'dating'; store.selectedAnimation = '' }"
            :disabled="!currentChar?.dating"
            class="w-full py-2 rounded-full flex items-center justify-center font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            :class="store.animationCategory === 'dating' 
              ? 'bg-indigo-600 text-white shadow-lg' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:hover:bg-gray-700'"
          >
            Fated Guest
          </button>
        </div>
      </div>
      <div class="p-2">
        <button
          @click="hitAreaVisible = !hitAreaVisible"
          :disabled="store.animationCategory !== 'dating'"
          class="w-full py-2 rounded-full flex items-center justify-center font-semibold text-sm transition-all"
          :class="{
            'disabled:opacity-50 disabled:cursor-not-allowed': store.animationCategory !== 'dating',
            'bg-orange-600 text-white shadow-lg': hitAreaVisible && store.animationCategory === 'dating',
            'bg-gray-700 text-gray-300 hover:bg-gray-600': !hitAreaVisible && store.animationCategory === 'dating',
            'bg-gray-700 text-gray-400 opacity-50 cursor-not-allowed': store.animationCategory !== 'dating'
          }"
        >
          Hit Area
        </button>
      </div>
      <div class="p-2" :class="{ 'opacity-50 pointer-events-none': store.animationCategory !== 'dating' }">
        <div class="rounded-full relative border-none shadow-none overflow-hidden">
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
              :disabled="store.animationCategory !== 'dating'"
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
      <div class="p-2 overflow-hidden relative">
        <div class="flex items-center justify-between pr-2">
          <span></span>
          <button
            @click="toggleLoveMode"
            :disabled="hitAreaScale < 0.5 || !hasIdle3"
            class="transition-all relative"
            :class="(hitAreaScale >= 0.5 && hasIdle3)
              ? 'cursor-pointer hover:scale-110' 
              : 'cursor-not-allowed opacity-50'"
          >
            <svg class="w-10 h-10 transition-colors" :class="[loveMode && 'animate-heartbeat']" viewBox="0 0 24 24" fill="none" stroke="url(#heartGradient)" stroke-width="1">
              <defs>
                <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#ff69b4;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#d91e63;stop-opacity:1" />
                </linearGradient>
              </defs>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="currentColor" :style="{ color: hitAreaScale >= 0.5 ? '#ff69b4' : '#4b5563' }"></path>
            </svg>
            <span v-if="loveMode" class="absolute inset-0 animate-ripple rounded-full" style="border: 2px solid #ff69b4;"></span>
            <span v-if="loveMode" class="absolute inset-0 animate-ripple rounded-full" style="border: 2px solid #d91e63; animation-delay: 0.2s;"></span>
          </button>
        </div>
        <!-- Floating hearts -->
        <div v-if="loveMode" class="absolute inset-0 pointer-events-none">
          <svg v-for="i in 20" :key="i" class="absolute animate-float-heart" :style="{ width: '16px', height: '16px', left: (85 - i * 2) + '%', top: (20 + Math.random() * 60) + '%', animationDelay: (i * 0.35 - 7) + 's' }" viewBox="0 0 24 24" fill="currentColor" style="color: #ff69b4;">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
      </div>
      <div class="px-2 -mt-2 pb-2 flex flex-col gap-2">
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
      <div class="p-2">
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
          Reset View
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
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs, ref, watch, onMounted, onUnmounted } from 'vue'
import { useCharacterStore } from '@/stores/characterStore'

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
const loveMode = ref(false)
const isHeartBeating = ref(false)

const emit = defineEmits(['select', 'reset-camera', 'screenshot', 'export-animation', 'category-change', 'yapping-mode', 'hit-area-toggle', 'mood-changed', 'love-mode-toggle'])

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
const hasIdle3 = computed(() => animations.value.includes('idle3'))
const layerSourceSeparator = ' > '
const hasYappingAnimation = computed(() => {
  const result = animations.value.some(anim => anim.includes('_face0_talk'))
  return result
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

function onSliderChange() {
  // Don't emit mood changes if love mode is active
  if (loveMode.value) {
    return
  }
  
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

function isLayerVisible(name: string) {
  const value = store.layerVisibility[name]
  return value !== false
}

function toggleLayer(name: string) {
  store.layerVisibility[name] = !isLayerVisible(name)
}

function selectAllLayers() {
  filteredLayers.value.forEach(layer => {
    store.layerVisibility[layer.key] = true
  })
}

function deselectAllLayers() {
  filteredLayers.value.forEach(layer => {
    store.layerVisibility[layer.key] = false
  })
}

function toggleLoveMode() {
  loveMode.value = !loveMode.value
  
  // Only switch animations if in Fated Guest (dating) mode
  if (store.animationCategory === 'dating') {
    if (loveMode.value) {
      // When activating love mode, emit love-mode-toggle event (which will handle motion + idle3)
      emit('love-mode-toggle', { enabled: true, animation: 'idle3' })
    } else {
      // When deactivating love mode, emit love-mode-toggle event (which will switch back to idle2)
      emit('love-mode-toggle', { enabled: false, animation: 'idle2' })
    }
  } else {
    emit('love-mode-toggle', loveMode.value)
  }
}

watch(() => store.animationCategory, () => {
  emit('category-change');
  
  // Auto-toggle hit area button twice when entering Fated Guests mode
  if (store.animationCategory === 'dating' && currentChar.value?.dating) {
    // First click - open
    hitAreaVisible.value = true
    
    // Second click - close (after a brief delay)
    setTimeout(() => {
      hitAreaVisible.value = false
    }, 500)
  }
});

watch(yappingMode, (enabled) => {
  console.log('Yapping mode toggled:', enabled)
  if (enabled) {
    // Find idle animation
    const idleAnim = animations.value.find(anim => anim.toLowerCase().includes('idle'))
    // Find the _face0_talk animation
    const talkAnim = animations.value.find(anim => anim.includes('_face0_talk'))
    
    console.log('Found animations:', { idleAnim, talkAnim, availableAnims: animations.value })
    
    if (idleAnim && talkAnim) {
      // Emit event to play both animations
      emit('yapping-mode', { enabled: true, idleAnim, talkAnim })
    } else {
      console.warn('Missing idle or talk animation')
      yappingMode.value = false
    }
  } else {
    emit('yapping-mode', { enabled: false })
  }
});

watch(() => store.selectedCharacterId, () => {
  // Reset slider to 0 (Morning Mood) when character changes
  hitAreaScale.value = 0
  
  // Reset yapping mode when character changes
  yappingMode.value = false
  
  // Auto-activate Ultimate if character has cutscene
  const charData = currentChar.value
  if (charData?.cutscene) {
    store.animationCategory = 'ultimate'
  } 
  // Auto-activate Fated Guest if character has dating
  else if (charData?.dating) {
    store.animationCategory = 'dating'
  }
  // Otherwise default to character
  else {
    store.animationCategory = 'character'
  }
});

// Reset mood to Morning when switching animation categories
watch(() => store.animationCategory, () => {
  hitAreaScale.value = 0 // Reset to Morning Mood when changing modes
})

watch(hitAreaScale, (newScale) => {
  // Auto-deactivate love mode when switching to Morning Mood
  if (newScale < 0.5 && loveMode.value) {
    loveMode.value = false
  }
})

watch(hitAreaVisible, (visible) => {
  try {
    emit('hit-area-toggle', visible)
  } catch (error) {
    console.error('Error toggling hit area:', error)
  }
});

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  
  // Auto-toggle hit area button twice if already in Fated Guests mode on mount
  if (store.animationCategory === 'dating' && currentChar.value?.dating) {
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

@keyframes heartbeat {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.3);
  }
  50% {
    transform: scale(1);
  }
  75% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes ripple {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
  }
}

@keyframes float-heart {
  0% {
    transform: translateX(0) translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateX(-280px) translateY(0);
    opacity: 0;
  }
}

.animate-heartbeat {
  animation: heartbeat 0.6s ease-in-out infinite;
}

.animate-ripple {
  animation: ripple 0.6s ease-out infinite;
}

.animate-float-heart {
  animation: float-heart 4s ease-out infinite;
}
</style>
