<template>
  <div class="enhanced-layout" :class="`layout-${layoutMode}`">
    <!-- Desktop: Three-Column Layout -->
    <template v-if="layoutMode === 'desktop'">
      <LeftSidebar class="left-sidebar" />
      <CenterViewport class="center-viewport" />
      <RightSidebar class="right-sidebar" />
    </template>

    <!-- Tablet: Collapsible Sidebars -->
    <template v-else-if="layoutMode === 'tablet'">
      <div class="tablet-header">
        <button @click="toggleLeftSidebar" class="sidebar-toggle">☰ Characters</button>
        <div class="center-label">Animation Viewer</div>
        <button @click="toggleRightSidebar" class="sidebar-toggle">Tools ⚙</button>
      </div>
      
      <LeftSidebar 
        v-show="leftSidebarOpen"
        class="sidebar tablet-left-sidebar"
      />
      <CenterViewport class="center-viewport" />
      <RightSidebar 
        v-show="rightSidebarOpen"
        class="sidebar tablet-right-sidebar"
      />
    </template>

    <!-- Mobile: Stacked Layout -->
    <template v-else>
      <div class="mobile-header">
        <button @click="showCharacterTab = !showCharacterTab" class="menu-toggle">☰</button>
        <h1>Brown Dust 2</h1>
      </div>
      
      <CenterViewport class="mobile-viewport" />
      
      <div class="mobile-footer">
        <button @click="activeTab = 'characters'" class="tab-btn" :class="{ active: activeTab === 'characters' }">Characters</button>
        <button @click="activeTab = 'tools'" class="tab-btn" :class="{ active: activeTab === 'tools' }">Tools</button>
      </div>
      
      <!-- Tab panels -->
      <LeftSidebar v-show="activeTab === 'characters'" class="mobile-tab-panel" />
      <RightSidebar v-show="activeTab === 'tools'" class="mobile-tab-panel" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import LeftSidebar from './LeftSidebar.vue'
import CenterViewport from './CenterViewport.vue'
import RightSidebar from './RightSidebar.vue'

type LayoutMode = 'desktop' | 'tablet' | 'mobile'

const layoutMode = ref<LayoutMode>('desktop')
const leftSidebarOpen = ref(true)
const rightSidebarOpen = ref(true)
const activeTab = ref<'characters' | 'tools'>('characters')

const toggleLeftSidebar = () => {
  leftSidebarOpen.value = !leftSidebarOpen.value
  if (leftSidebarOpen.value) rightSidebarOpen.value = false
}

const toggleRightSidebar = () => {
  rightSidebarOpen.value = !rightSidebarOpen.value
  if (rightSidebarOpen.value) leftSidebarOpen.value = false
}

const handleResize = () => {
  const width = window.innerWidth
  if (width < 768) {
    layoutMode.value = 'mobile'
  } else if (width < 1200) {
    layoutMode.value = 'tablet'
  } else {
    layoutMode.value = 'desktop'
  }
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="scss">
$sidebar-width: 400px;
$sidebar-width-tablet: 350px;
$mobile-breakpoint: 768px;
$tablet-breakpoint: 1200px;

$bg-primary: #1a1a1f;
$bg-secondary: #2a2a2f;
$border-color: #2a2a2f;
$accent-color: #00ff00;
$text-primary: #e0e0e0;

.enhanced-layout {
  display: grid;
  width: 100%;
  height: 100vh;
  gap: 0;

  &.layout-desktop {
    grid-template-columns: $sidebar-width 1fr $sidebar-width-tablet;
    grid-template-rows: 1fr;

    .left-sidebar {
      grid-column: 1;
      border-right: 1px solid $border-color;
    }

    .center-viewport {
      grid-column: 2;
    }

    .right-sidebar {
      grid-column: 3;
      border-left: 1px solid $border-color;
    }
  }

  &.layout-tablet {
    grid-template-columns: 1fr;
    grid-template-rows: 50px 1fr;

    .tablet-header {
      grid-row: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 16px;
      border-bottom: 1px solid $border-color;
      background: $bg-secondary;
      gap: 12px;

      .sidebar-toggle {
        background: $accent-color;
        color: #000;
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        font-size: 12px;

        &:hover {
          background: #00dd00;
        }
      }

      .center-label {
        flex: 1;
        text-align: center;
        font-weight: bold;
        font-size: 14px;
      }
    }

    .sidebar {
      grid-row: 2;
      position: absolute;
      width: $sidebar-width-tablet;
      max-height: calc(100vh - 50px);
      background: $bg-primary;
      border: 1px solid $border-color;
      z-index: 100;
      overflow-y: auto;

      &.tablet-left-sidebar {
        left: 0;
        border-right: 1px solid $border-color;
      }

      &.tablet-right-sidebar {
        right: 0;
        border-left: 1px solid $border-color;
      }
    }

    .center-viewport {
      grid-row: 2;
      width: 100%;
    }
  }

  &.layout-mobile {
    grid-template-columns: 1fr;
    grid-template-rows: 50px 1fr 50px;

    .mobile-header {
      grid-row: 1;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 0 16px;
      border-bottom: 1px solid $border-color;
      background: $bg-secondary;

      .menu-toggle {
        background: none;
        border: none;
        color: $accent-color;
        font-size: 20px;
        cursor: pointer;
      }

      h1 {
        margin: 0;
        flex: 1;
        font-size: 16px;
        color: $text-primary;
      }
    }

    .mobile-viewport {
      grid-row: 2;
      width: 100%;
    }

    .mobile-footer {
      grid-row: 3;
      display: flex;
      gap: 0;
      border-top: 1px solid $border-color;
      background: $bg-secondary;

      .tab-btn {
        flex: 1;
        background: $bg-secondary;
        border: none;
        color: #999;
        padding: 8px;
        cursor: pointer;
        border-top: 2px solid transparent;
        font-size: 12px;

        &.active {
          color: $accent-color;
          border-top-color: $accent-color;
        }

        &:hover {
          background: darken($bg-secondary, 5%);
        }
      }
    }

    .mobile-tab-panel {
      position: absolute;
      bottom: 50px;
      left: 0;
      right: 0;
      max-height: calc(100vh - 100px);
      background: $bg-primary;
      border-top: 1px solid $border-color;
      overflow-y: auto;
      z-index: 50;
    }
  }
}

/* Scrollbar styling */
.sidebar::-webkit-scrollbar,
.mobile-tab-panel::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track,
.mobile-tab-panel::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar::-webkit-scrollbar-thumb,
.mobile-tab-panel::-webkit-scrollbar-thumb {
  background: #3a3a3f;
  border-radius: 3px;

  &:hover {
    background: #4a4a4f;
  }
}
</style>
