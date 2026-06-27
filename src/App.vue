<template>
  <div class="bg-gray-900 text-white h-dvh max-h-dvh flex flex-col">
    <div class="flex flex-1 flex-col lg:flex-row h-full min-h-0 overflow-hidden">
      <div v-show="!inspectMode" class="hidden lg:flex flex-col min-h-0">
        <CharacterSidebar
          @select="onSelectCharacter"
          class="lg:w-80"
        />
      </div>
      <main class="relative flex-1 p-2 overflow-hidden">
        <div class="absolute top-2 left-2 lg:hidden z-50 flex items-center gap-2">
          <button v-show="!overlayActive" class="p-2" @click="showMobileControls = true">
            <MenuIcon />
          </button>
          <button v-show="!overlayActive" class="p-2" @click="onResetCamera">
            <CameraResetIcon />
          </button>
          <button
            v-show="!overlayActive"
            class="p-2"
            @click="store.playing = !store.playing"
          >
            <PauseIcon v-if="store.playing" />
            <PlayIcon v-else />
          </button>
          <select
            v-show="!overlayActive"
            v-model="store.selectedSkin"
            class="bg-gray-700 text-white"
          >
            <option v-for="skin in skins" :key="skin" :value="skin">{{ skin }}</option>
          </select>
          <select
            v-show="!overlayActive"
            v-model="store.selectedAnimation"
            class="bg-gray-700 text-white"
          >
            <option v-for="name in animations" :key="name" :value="name">{{ name }}</option>
          </select>
        </div>
        <div class="absolute top-17 left-4 lg:hidden z-50 flex flex-col items-start gap-2">
          <button
            v-show="!overlayActive"
            :aria-pressed="inspectMode"
            aria-label="Inspect animation"
            class="pb-2"
            @click="onInspectModeChange(!inspectMode)"
          >
            <InspectAnimationIcon :active="inspectMode" />
          </button>
          <button
            v-show="!overlayActive"
            @click="store.layerSelectionEnabled = !store.layerSelectionEnabled"
          >
            <LayerSelectIcon :active="store.layerSelectionEnabled" />
          </button>
          <button
            v-show="!overlayActive"
            aria-label="Zoom out"
            @click="onZoomOut"
          >
            <MinusIcon />
          </button>
          <button
            v-show="!overlayActive"
            aria-label="Zoom in"
            @click="onZoomIn"
          >
            <PlusIcon />
          </button>
        </div>
        <SpineViewer
          ref="viewerRef"
          :mobile-overlay-active="overlayActive"
          :inspect-mode="inspectMode"
          @update:inspect-mode="onInspectModeChange"
          @animations="animations = $event"
          @skins="skins = $event"
        />
        <div
          v-if="showLayerSelectionHint"
          class="absolute top-3 left-1/2 -translate-x-1/2 z-50 hidden lg:block pointer-events-none"
        >
          <div class="rounded-xl border border-gray-700 bg-gray-900/90 px-4 py-3 text-sm text-white shadow-lg shadow-black/40 backdrop-blur-sm">
            Use <span class="font-semibold text-indigo-300">H</span> to hide the selected layer,
            <span class="font-semibold text-indigo-300">U</span> to revert the last change, and
            <span class="font-semibold text-indigo-300">Esc</span> to reset the state.
          </div>
        </div>
      </main>
      <div class="order-1 lg:order-none hidden lg:flex flex-col min-h-0">
        <AnimationSidebar
          :animations="animations"
          :skins="skins"
          :exporting="isExporting"
          :screenshotting="isScreenshotting"
          @select="onSelectAnimation"
          @reset-camera="onResetCamera"
          @screenshot="onScreenshot"
          @export-animation="onExportAnimation"
          @category-change="onCategoryChange"
          @yapping-mode="onYappingMode"
          @hit-area-toggle="onHitAreaToggle"
          @mood-changed="onMoodChanged"
          class="lg:w-64"
        />
      </div>
    </div>
    <div
      v-if="showMobileControls"
      class="fixed inset-0 z-20 bg-gray-900 lg:hidden flex flex-col"
    >
      <button
        class="absolute top-3 right-4"
        @click="showMobileControls = false"
      >
        ✕
      </button>
      <div class="flex-1 flex flex-col gap-2 overflow-hidden p-2">
        <div class="flex-none">
          <AnimationSidebar
            :animations="animations"
            :skins="skins"
            :exporting="isExporting"
            :screenshotting="isScreenshotting"
            @select="onSelectAnimation"
            @reset-camera="onResetCamera"
            @screenshot="onScreenshot"
            @export-animation="onExportAnimation"
            @yapping-mode="onYappingMode"
            @hit-area-toggle="onHitAreaToggle"
            @mood-changed="onMoodChanged"
          />
        </div>
        <div class="flex-1 min-h-0">
          <CharacterSidebar @select="onSelectCharacter" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CharacterSidebar from '@/components/CharacterSideBar.vue'
import AnimationSidebar from '@/components/AnimationSideBar.vue'
import SpineViewer from '@/components/SpineViewer.vue'
import { ref, watchEffect, computed, watch, onBeforeUnmount } from 'vue'
import { useCharacterStore } from '@/stores/characterStore'
import { buildUrl } from './utils/urlSync'
import { moodMotionConfig } from '@/utils/hitAreaConfig'

import CameraResetIcon from '@/components/icons/CameraResetIcon.vue';
import MenuIcon from '@/components/icons/MenuIcon.vue';
import PauseIcon from '@/components/icons/PauseIcon.vue';
import PlayIcon from '@/components/icons/PlayIcon.vue';
import InspectAnimationIcon from '@/components/icons/InspectAnimationIcon.vue';
import LayerSelectIcon from '@/components/icons/LayerSelectIcon.vue';
import MinusIcon from '@/components/icons/MinusIcon.vue';
import PlusIcon from '@/components/icons/PlusIcon.vue';

const store = useCharacterStore()

const animations = ref<string[]>([])
const skins = ref<string[]>([])
const viewerRef = ref<InstanceType<typeof SpineViewer> | null>(null)
const isExporting = ref(false)
const isScreenshotting = ref(false)
const showMobileControls = ref(false)
const showLayerSelectionHint = ref(false)
const inspectMode = ref(false)
const overlayActive = computed(
  () => showMobileControls.value,
)
let layerSelectionHintTimeout: number | null = null

function onSelectCharacter(id: string) {
  if (id === store.selectedCharacterId) return
  store.selectedCharacterId = id
  store.selectedAnimation = ''
  store.selectedSkin = ''
  animations.value = []
  skins.value = []
  showMobileControls.value = false
}

function onSelectAnimation(name: string) {
  store.selectedAnimation = name
  showMobileControls.value = false
}

function onResetCamera() {
  viewerRef.value?.resetCamera()
}

function onZoomIn() {
  viewerRef.value?.zoomIn()
}

function onZoomOut() {
  viewerRef.value?.zoomOut()
}

function onScreenshot(value: boolean) {
  if (!viewerRef.value) return
  showMobileControls.value = false
  showMobileControls.value = false
  isScreenshotting.value = true
  viewerRef.value.saveScreenshot(value)
  isScreenshotting.value = false
}

async function onExportAnimation({ format, transparent }: { format: 'video' | 'frames'; transparent: boolean }) {
  if (!viewerRef.value) return
  showMobileControls.value = false
  isExporting.value = true
  if (format === 'frames') {
    await viewerRef.value.exportAnimationFrames(transparent)
  } else {
    await viewerRef.value.exportAnimation(transparent)
  }
  isExporting.value = false
}

function onCategoryChange() {
  showMobileControls.value = false;
}

function onYappingMode(data: { enabled: boolean; idleAnim?: string; talkAnim?: string }) {
  if (!viewerRef.value) return
  viewerRef.value.setYappingMode(data.enabled, data.idleAnim, data.talkAnim)
}

function onHitAreaToggle(visible: boolean) {
  if (!viewerRef.value) return
  viewerRef.value.setHitAreaVisible(visible)
}

function onMoodChanged(data: { mood: string; animation: string }) {
  if (!viewerRef.value) return
  
  const charId = store.selectedCharacterId
  const motionAnim = moodMotionConfig[charId]
  
  // Always update store.selectedAnimation to the final idle state
  store.selectedAnimation = data.animation
  
  if (motionAnim && data.animation === 'idle2') {
    // Play motion first, then queue idle2 after it finishes
    viewerRef.value.playAnimationSequence([motionAnim, data.animation])
  } else {
    // Play idle animation directly
    viewerRef.value.playAnimation(data.animation)
  }
  
  // Reload hit areas for the new idle state (but don't show them)
  viewerRef.value.reloadHitAreas()
}

function onInspectModeChange(value: boolean) {
  inspectMode.value = value
  if (value) {
    showMobileControls.value = false
  }
}

function clearLayerSelectionHintTimeout() {
  if (layerSelectionHintTimeout === null) return
  window.clearTimeout(layerSelectionHintTimeout)
  layerSelectionHintTimeout = null
}

function isDesktopViewport() {
  return typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches
}

watch(
  () => store.layerSelectionEnabled,
  enabled => {
    clearLayerSelectionHintTimeout()
    if (!enabled || !isDesktopViewport()) {
      showLayerSelectionHint.value = false
      return
    }
    showLayerSelectionHint.value = true
    layerSelectionHintTimeout = window.setTimeout(() => {
      showLayerSelectionHint.value = false
      layerSelectionHintTimeout = null
    }, 3000)
  },
)

onBeforeUnmount(() => {
  clearLayerSelectionHintTimeout()
})

watchEffect(() => {
  const query = buildUrl(store)
  history.replaceState(null, '', `${window.location.pathname}?${query}`)
}, { flush: 'sync' })
</script>
