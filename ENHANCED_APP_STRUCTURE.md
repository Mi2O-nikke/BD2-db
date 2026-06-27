# Enhanced App.vue Structure & Component Architecture

## Current App.vue
The current BrownDust2 `App.vue` is likely simple, with basic routing or direct component rendering. This document outlines the new enhanced structure.

## New App.vue Pattern

```vue
<template>
  <div id="app" class="app-container" :class="appClasses">
    <!-- Top Navigation (Optional) -->
    <Navbar v-if="showNavbar" />
    
    <!-- Main Layout -->
    <EnhancedLayout 
      :layout-mode="layoutMode"
      :mobile-overlay-active="mobileOverlayActive"
      @toggle-overlay="toggleMobileOverlay"
    />
    
    <!-- Mobile Menu Overlay (if needed) -->
    <MobileMenuOverlay 
      v-if="showMobileMenu && isMobile"
      @close="showMobileMenu = false"
    />
    
    <!-- Toast/Message Container -->
    <MessageContainer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import EnhancedLayout from '@/layouts/EnhancedLayout.vue'
import Navbar from '@/components/Navbar.vue'
import MessageContainer from '@/components/ui/MessageContainer.vue'
import MobileMenuOverlay from '@/components/ui/responsive/MobileMenuOverlay.vue'

// Layout & Responsive
const layoutMode = ref<'desktop' | 'tablet' | 'mobile'>('desktop')
const mobileOverlayActive = ref(false)
const showMobileMenu = ref(false)
const showNavbar = ref(true)

// Responsive logic
const isMobile = computed(() => layoutMode.value === 'mobile')
const isTablet = computed(() => layoutMode.value === 'tablet')

const appClasses = computed(() => ({
  mobile: isMobile.value,
  tablet: isTablet.value,
  desktop: !isMobile.value && !isTablet.value,
  'mobile-overlay-active': mobileOverlayActive.value,
}))

const toggleMobileOverlay = (active: boolean) => {
  mobileOverlayActive.value = active
}

// Handle window resize for responsive breakpoints
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
.app-container {
  width: 100%;
  min-height: 100vh;
  background: #1a1a1f;
  color: #e0e0e0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  
  &.mobile-overlay-active {
    overflow: hidden;
  }
}
</style>
```

---

## EnhancedLayout.vue Structure

```vue
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
        <button @click="$emit('toggle-overlay', true)" class="menu-toggle">☰</button>
        <h1>Brown Dust 2 Viewer</h1>
      </div>
      
      <CenterViewport class="mobile-viewport" />
      
      <div class="mobile-footer">
        <button @click="showCharacterTab = true" class="tab-btn" :class="{ active: showCharacterTab }">Characters</button>
        <button @click="showToolsTab = true" class="tab-btn" :class="{ active: showToolsTab }">Tools</button>
      </div>
      
      <!-- Tab panels -->
      <LeftSidebar v-show="showCharacterTab" class="mobile-tab-panel" />
      <RightSidebar v-show="showToolsTab" class="mobile-tab-panel" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import LeftSidebar from './LeftSidebar.vue'
import CenterViewport from './CenterViewport.vue'
import RightSidebar from './RightSidebar.vue'

interface Props {
  layoutMode: 'desktop' | 'tablet' | 'mobile'
  mobileOverlayActive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  mobileOverlayActive: false,
})

const emit = defineEmits<{
  'toggle-overlay': [active: boolean]
}>()

// Tablet sidebar toggles
const leftSidebarOpen = ref(true)
const rightSidebarOpen = ref(true)

const toggleLeftSidebar = () => {
  leftSidebarOpen.value = !leftSidebarOpen.value
  rightSidebarOpen.value = false // Close right sidebar
}

const toggleRightSidebar = () => {
  rightSidebarOpen.value = !rightSidebarOpen.value
  leftSidebarOpen.value = false // Close left sidebar
}

// Mobile tab logic
const showCharacterTab = ref(false)
const showToolsTab = ref(false)
</script>

<style scoped lang="scss">
$sidebar-width: 400px;
$sidebar-width-tablet: 350px;

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
      border-right: 1px solid #2a2a2f;
    }
    
    .center-viewport {
      grid-column: 2;
    }
    
    .right-sidebar {
      grid-column: 3;
      border-left: 1px solid #2a2a2f;
    }
  }
  
  &.layout-tablet {
    grid-template-columns: 1fr;
    grid-template-rows: 50px 1fr 60px;
    
    .tablet-header {
      grid-row: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 16px;
      border-bottom: 1px solid #2a2a2f;
      background: #1f1f24;
      gap: 12px;
      
      .sidebar-toggle {
        background: #00ff00;
        color: #000;
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        
        &:hover {
          background: #00dd00;
        }
      }
      
      .center-label {
        flex: 1;
        text-align: center;
        font-weight: bold;
      }
    }
    
    .sidebar {
      grid-row: 2;
      position: absolute;
      width: $sidebar-width-tablet;
      max-height: calc(100vh - 110px);
      background: #1a1a1f;
      border: 1px solid #2a2a2f;
      z-index: 100;
      overflow-y: auto;
      
      &.tablet-left-sidebar {
        left: 0;
        border-right: 1px solid #2a2a2f;
      }
      
      &.tablet-right-sidebar {
        right: 0;
        border-left: 1px solid #2a2a2f;
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
      border-bottom: 1px solid #2a2a2f;
      background: #1f1f24;
      
      .menu-toggle {
        background: none;
        border: none;
        color: #00ff00;
        font-size: 20px;
        cursor: pointer;
      }
      
      h1 {
        margin: 0;
        flex: 1;
        font-size: 16px;
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
      border-top: 1px solid #2a2a2f;
      background: #1f1f24;
      
      .tab-btn {
        flex: 1;
        background: #2a2a2f;
        border: none;
        color: #999;
        padding: 8px;
        cursor: pointer;
        border-top: 2px solid transparent;
        
        &.active {
          color: #00ff00;
          border-top-color: #00ff00;
        }
        
        &:hover {
          background: #333;
        }
      }
    }
    
    .mobile-tab-panel {
      position: absolute;
      bottom: 50px;
      left: 0;
      right: 0;
      max-height: calc(100vh - 100px);
      background: #1a1a1f;
      border-top: 1px solid #2a2a2f;
      overflow-y: auto;
      z-index: 50;
    }
  }
}

/* Scrollbar styling */
.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar::-webkit-scrollbar-thumb {
  background: #3a3a3f;
  border-radius: 3px;
  
  &:hover {
    background: #4a4a4f;
  }
}
</style>
```

---

## Component Breakdown

### LeftSidebar.vue
```vue
<template>
  <div class="left-sidebar">
    <div class="sidebar-header">
      <h2>Characters</h2>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search..."
        class="search-input"
      />
    </div>
    
    <CharacterList 
      :search-query="searchQuery"
      @select="selectCharacter"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CharacterList from '@/components/ui/character/CharacterList.vue'

const searchQuery = ref('')

const selectCharacter = (characterId: string) => {
  // Emit or dispatch to store
}
</script>

<style scoped lang="scss">
.left-sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #1a1a1f;
  
  .sidebar-header {
    padding: 16px;
    border-bottom: 1px solid #2a2a2f;
    
    h2 {
      margin: 0 0 12px 0;
      font-size: 18px;
    }
    
    .search-input {
      width: 100%;
      padding: 8px 12px;
      background: #2a2a2f;
      border: 1px solid #3a3a3f;
      color: #e0e0e0;
      border-radius: 4px;
      
      &::placeholder {
        color: #666;
      }
      
      &:focus {
        outline: none;
        border-color: #00ff00;
        box-shadow: 0 0 0 2px rgba(0, 255, 0, 0.1);
      }
    }
  }
  
  /* Scrollable content */
  overflow-y: auto;
  flex: 1;
}
</style>
```

### CenterViewport.vue
```vue
<template>
  <div class="center-viewport">
    <!-- SpineViewer (Unchanged) -->
    <SpineViewer 
      :mobile-overlay-active="mobileOverlayActive"
      :inspect-mode="inspectMode"
      @update:inspect-mode="inspectMode = $event"
    />
    
    <!-- Floating Toolbar (new overlay controls) -->
    <div class="viewport-toolbar">
      <button @click="zoomOut" class="toolbar-btn" title="Zoom Out">−</button>
      <button @click="resetZoom" class="toolbar-btn" title="Reset">↺</button>
      <button @click="zoomIn" class="toolbar-btn" title="Zoom In">+</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SpineViewer from '@/components/SpineViewer.vue'

const mobileOverlayActive = ref(false)
const inspectMode = ref(false)

const zoomIn = () => {
  // Zoom logic
}

const zoomOut = () => {
  // Zoom logic
}

const resetZoom = () => {
  // Reset zoom
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
      
      &:hover {
        background: #3a3a3f;
        border-color: #00ff00;
      }
    }
  }
}
</style>
```

### RightSidebar.vue
```vue
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
      <!-- Animation Tab -->
      <AnimationToolsPanel v-show="activeTab === 'animation'" />
      
      <!-- Export Tab -->
      <ExportToolsPanel v-show="activeTab === 'export'" />
      
      <!-- Background Tab -->
      <BackgroundControls v-show="activeTab === 'background'" />
      
      <!-- Advanced Tab -->
      <AdvancedToolsPanel v-show="activeTab === 'advanced'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AnimationToolsPanel from '@/components/ui/AnimationToolsPanel.vue'
import ExportToolsPanel from '@/components/ui/ExportToolsPanel.vue'
import BackgroundControls from '@/components/ui/BackgroundControls.vue'
import AdvancedToolsPanel from '@/components/ui/AdvancedToolsPanel.vue'

const activeTab = ref('animation')

const tabs = [
  { id: 'animation', label: '▶ Animation' },
  { id: 'export', label: '⬇ Export' },
  { id: 'background', label: '🎨 Background' },
  { id: 'advanced', label: '⚙ Advanced' },
]
</script>

<style scoped lang="scss">
.right-sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #1a1a1f;
  border-left: 1px solid #2a2a2f;
  
  .tabs {
    display: flex;
    gap: 0;
    border-bottom: 1px solid #2a2a2f;
    padding: 0;
    background: #0f0f12;
    
    .tab-btn {
      flex: 1;
      padding: 10px 8px;
      background: none;
      border: none;
      color: #666;
      cursor: pointer;
      font-size: 12px;
      border-bottom: 2px solid transparent;
      transition: all 0.2s;
      
      &:hover {
        color: #00ff00;
      }
      
      &.active {
        color: #00ff00;
        border-bottom-color: #00ff00;
      }
    }
  }
  
  .tab-content {
    flex: 1;
    overflow-y: auto;
    padding: 12px;
  }
}
</style>
```

---

## Key Features

### 1. **Responsive Grid System**
- Desktop: Fixed three-column layout (400px | 1fr | 350px)
- Tablet: Overlapping collapsible sidebars
- Mobile: Stacked with tab navigation

### 2. **State Management**
- Use Pinia for centralized state
- characterStore (existing) + uiStateStore (new)
- Computed properties for reactive UI

### 3. **Performance Optimizations**
- Lazy load components with dynamic imports
- Virtual scrolling for large character lists
- Memoized selectors
- CSS containment for viewport

### 4. **Accessibility**
- Semantic HTML (button, nav, etc.)
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus management

### 5. **Style Strategy**
- CSS Grid for layouts
- CSS Variables for theming
- SCSS for organization
- Dark theme default (#1a1a1f background)

---

## Migration Path

1. **Create new layout files** in `src/layouts/`
2. **Update App.vue** to use EnhancedLayout
3. **Create UI components** in `src/components/ui/`
4. **Build out sidebars** (Left → Right)
5. **Test responsive breakpoints**
6. **Style polish** and accessibility review

---

## Browser Support

- Chrome/Edge: 100+
- Firefox: 95+
- Safari: 15+
- Mobile browsers: iOS 14+, Android 10+

---

## Performance Targets

- Initial load: < 3s
- FPS while animating: 60fps
- Character list scroll: Smooth (no jank)
- Sidebar toggle: < 100ms
- Export generation: < 5s for 60-frame GIF

---

## CSS Class Naming Convention

```
.component-name            // Component root
.component-name__element   // Element (BEM)
.component-name--modifier  // Modifier state
.is-state                  // State classes
.has-property              // Conditional classes
```

Example:
```css
.sidebar {}
.sidebar__header {}
.sidebar__content {}
.sidebar--collapsed {}
.is-active {}
.has-scrollbar {}
```
