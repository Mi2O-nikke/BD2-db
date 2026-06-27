<template>
  <div class="center-viewport">
    <!-- Main SpineViewer (UNCHANGED) -->
    <SpineViewer 
      :mobile-overlay-active="mobileOverlayActive"
      :inspect-mode="inspectMode"
      @update:inspect-mode="inspectMode = $event"
    />

    <!-- Floating Toolbar -->
    <div class="viewport-toolbar" v-if="!mobileOverlayActive">
      <button @click="zoomOut" class="toolbar-btn" title="Zoom Out">−</button>
      <button @click="resetZoom" class="toolbar-btn" title="Reset">↺</button>
      <button @click="zoomIn" class="toolbar-btn" title="Zoom In">+</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SpineViewer from '@/components/SpineViewer.vue'

defineProps<{
  mobileOverlayActive?: boolean
}>()

const inspectMode = ref(false)

const zoomIn = () => {
  console.log('Zoom in')
}

const zoomOut = () => {
  console.log('Zoom out')
}

const resetZoom = () => {
  console.log('Reset zoom')
}
</script>

<style scoped lang="scss">
.center-viewport {
  position: relative;
  width: 100%;
  height: 100%;
  background: #0f0f12;

  .viewport-toolbar {
    position: absolute;
    top: 12px;
    right: 12px;
    display: flex;
    gap: 6px;
    z-index: 40;
    background: rgba(30, 30, 35, 0.9);
    padding: 6px;
    border-radius: 6px;
    border: 1px solid #2a2a2f;

    .toolbar-btn {
      width: 32px;
      height: 32px;
      background: #2a2a2f;
      color: #00ff00;
      border: 1px solid #3a3a3f;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
      transition: all 0.2s;

      &:hover {
        background: #3a3a3f;
        border-color: #00ff00;
      }

      &:active {
        background: #00ff00;
        color: #000;
      }
    }
  }
}
</style>
