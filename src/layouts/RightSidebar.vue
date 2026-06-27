<template>
  <div class="right-sidebar">
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-btn"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="tab-content">
      <!-- Animation Tab (Placeholder) -->
      <div v-show="activeTab === 'animation'" class="tab-panel">
        <h3>Animation Controls</h3>
        <p>Animation tools coming in Phase 3</p>
        <div class="placeholder-controls">
          <button class="placeholder-btn">▶ Play</button>
          <button class="placeholder-btn">⏸ Pause</button>
          <button class="placeholder-btn">⏹ Stop</button>
        </div>
      </div>

      <!-- Export Tab (Placeholder) -->
      <div v-show="activeTab === 'export'" class="tab-panel">
        <h3>Export Options</h3>
        <p>Export tools coming in Phase 3</p>
        <div class="placeholder-controls">
          <button class="placeholder-btn">📷 Screenshot</button>
          <button class="placeholder-btn">🎬 GIF</button>
          <button class="placeholder-btn">📹 WebM</button>
        </div>
      </div>

      <!-- Background Tab (Placeholder) -->
      <div v-show="activeTab === 'background'" class="tab-panel">
        <h3>Background Settings</h3>
        <p>Background controls coming in Phase 3</p>
        <div class="placeholder-controls">
          <div class="color-picker-placeholder">
            <div class="color-square"></div>
            <span>Color Picker</span>
          </div>
        </div>
      </div>

      <!-- Advanced Tab (Placeholder) -->
      <div v-show="activeTab === 'advanced'" class="tab-panel">
        <h3>Advanced Tools</h3>
        <p>Advanced tools coming soon</p>
        <div class="placeholder-controls">
          <button class="placeholder-btn">Layers</button>
          <button class="placeholder-btn">Inspect</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref<'animation' | 'export' | 'background' | 'advanced'>('animation')

const tabs = [
  { id: 'animation', label: '▶ Animation' },
  { id: 'export', label: '⬇ Export' },
  { id: 'background', label: '🎨 BG' },
  { id: 'advanced', label: '⚙ Advanced' },
]
</script>

<style scoped lang="scss">
$bg-primary: #1a1a1f;
$bg-secondary: #2a2a2f;
$bg-tertiary: #0f0f12;
$border-color: #2a2a2f;
$text-primary: #e0e0e0;
$text-secondary: #999;
$accent: #00ff00;

.right-sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: $bg-primary;
  border-left: 1px solid $border-color;

  .tabs {
    display: flex;
    gap: 0;
    border-bottom: 1px solid $border-color;
    padding: 0;
    background: $bg-tertiary;
    flex-shrink: 0;

    .tab-btn {
      flex: 1;
      padding: 10px 8px;
      background: none;
      border: none;
      color: $text-secondary;
      cursor: pointer;
      font-size: 11px;
      border-bottom: 2px solid transparent;
      transition: all 0.2s;

      &:hover {
        color: $accent;
      }

      &.active {
        color: $accent;
        border-bottom-color: $accent;
      }
    }
  }

  .tab-content {
    flex: 1;
    overflow-y: auto;
    padding: 12px;

    .tab-panel {
      h3 {
        margin: 0 0 8px 0;
        font-size: 14px;
        color: $text-primary;
      }

      p {
        margin: 0 0 12px 0;
        font-size: 12px;
        color: $text-secondary;
      }

      .placeholder-controls {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .placeholder-btn {
          padding: 8px 12px;
          background: $bg-secondary;
          border: 1px solid #3a3a3f;
          color: $accent;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s;

          &:hover {
            background: #3a3a3f;
            border-color: $accent;
          }
        }

        .color-picker-placeholder {
          display: flex;
          gap: 8px;
          align-items: center;
          padding: 8px;
          background: $bg-secondary;
          border-radius: 4px;

          .color-square {
            width: 32px;
            height: 32px;
            background: #000;
            border-radius: 4px;
            border: 1px solid #3a3a3f;
          }

          span {
            font-size: 12px;
            color: $text-secondary;
          }
        }
      }
    }
  }
}

/* Scrollbar styling */
.tab-content::-webkit-scrollbar {
  width: 6px;
}

.tab-content::-webkit-scrollbar-track {
  background: transparent;
}

.tab-content::-webkit-scrollbar-thumb {
  background: #3a3a3f;
  border-radius: 3px;

  &:hover {
    background: #4a4a4f;
  }
}
</style>
