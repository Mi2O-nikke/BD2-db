# Implementation Blueprint: Phase-by-Phase Guide

## Overview
This blueprint provides the actual code structure and implementation details for each phase of the integration project.

---

## Phase 1: Foundation & Layout Structure

### What Gets Built
1. New directory structure
2. Base layout components
3. Responsive grid system
4. State management setup

### Files to Create

#### `src/layouts/EnhancedLayout.vue`
**Size**: ~250 lines
**Purpose**: Main responsive layout wrapper
**Dependencies**: LeftSidebar, CenterViewport, RightSidebar

```vue
<!-- Template structure provided in ENHANCED_APP_STRUCTURE.md -->
<!-- Uses grid system for responsive layout -->
<!-- Handles mode switching: desktop/tablet/mobile -->
```

#### `src/layouts/LeftSidebar.vue`
**Size**: ~80 lines
**Purpose**: Character selection panel
**Dependencies**: CharacterList (to build in Phase 2)

#### `src/layouts/CenterViewport.vue`
**Size**: ~120 lines
**Purpose**: Main viewer with SpineViewer
**Features**: 
- Wraps SpineViewer.vue (unchanged)
- Adds floating toolbar overlay
- Passes through props/events

#### `src/layouts/RightSidebar.vue`
**Size**: ~150 lines
**Purpose**: Tools and controls sidebar
**Structure**: Tab-based (Animation | Export | Background | Advanced)

#### `src/stores/uiStateStore.ts`
**Size**: ~120 lines
**Purpose**: UI state management (new)
**State**:
```typescript
{
  layoutMode: 'desktop' | 'tablet' | 'mobile',
  leftSidebarOpen: boolean,
  rightSidebarOpen: boolean,
  activeRightTab: 'animation' | 'export' | 'background' | 'advanced',
  zoomLevel: number,
  inspectMode: boolean,
  mobileMenuOpen: boolean,
}
```

#### `src/styles/layout.scss`
**Size**: ~300 lines
**Purpose**: Grid, flexbox, and layout utilities
**Content**:
- Layout variables ($sidebar-width, $mobile-breakpoint, etc.)
- Grid definitions for desktop/tablet/mobile
- Responsive utilities
- Z-index management

#### `src/styles/theme.scss`
**Size**: ~200 lines
**Purpose**: Color palette and theme variables
**Variables**:
```scss
$color-bg-primary: #1a1a1f;
$color-bg-secondary: #2a2a2f;
$color-accent: #00ff00;
$color-text-primary: #e0e0e0;
$color-border: #2a2a2f;

$sidebar-width: 400px;
$sidebar-width-tablet: 350px;

$breakpoint-mobile: 768px;
$breakpoint-tablet: 1200px;
```

### Update Files

#### `src/App.vue`
**Changes**: Replace main layout with EnhancedLayout
**Before**: Simple root component
**After**: Responsive grid with EnhancedLayout wrapper

**New Code Pattern**:
```vue
<template>
  <div id="app" class="app-container">
    <EnhancedLayout :layout-mode="layoutMode" />
  </div>
</template>
```

#### `src/main.ts`
**Changes**: Add new SCSS imports
```typescript
import '@/styles/theme.scss'
import '@/styles/layout.scss'
import '@/styles/components.scss'
```

### Phase 1 Testing Checklist
- [ ] Layout renders without errors
- [ ] Grid displays correctly on desktop (3-column)
- [ ] Responsive breakpoints work (resize browser)
- [ ] No overlapping elements
- [ ] Scrollbars appear where needed
- [ ] Colors match design
- [ ] Z-index layers correct

### Phase 1 Deliverables
- ✅ Directory structure created
- ✅ Base layout components
- ✅ Responsive grid system
- ✅ Theme/color variables
- ✅ State management foundation

**Estimated Time**: 2-3 hours

---

## Phase 2: Left Sidebar (Character Selection)

### What Gets Built
1. Character list component
2. Character list item card
3. Search & filter functionality
4. Character grouping logic

### Files to Create

#### `src/components/ui/character/CharacterList.vue`
**Size**: ~200 lines
**Purpose**: Main character list container
**Props**: `searchQuery: string`
**Emits**: `@select="(id: string) => void"`

**Features**:
- Virtual scrolling for performance (100+ characters)
- Group expansion/collapse
- Highlights selected character

**Template Structure**:
```vue
<div class="character-list">
  <div v-for="group in groupedCharacters" :key="group.name">
    <div class="group-header" @click="toggleGroup(group.name)">
      {{ group.name }}
    </div>
    <div v-if="group.expanded" class="group-items">
      <CharacterListItem 
        v-for="char in group.characters"
        :key="char.id"
        :character="char"
        :selected="selectedId === char.id"
        @click="selectCharacter(char.id)"
      />
    </div>
  </div>
</div>
```

#### `src/components/ui/character/CharacterListItem.vue`
**Size**: ~100 lines
**Purpose**: Individual character card
**Props**:
```typescript
{
  character: { id: string; name: string; group?: string },
  selected: boolean,
}
```

**Features**:
- Character sprite/icon thumbnail
- Name display
- Hover effects
- Selection highlight

**Template Structure**:
```vue
<div class="character-item" :class="{ selected }">
  <img :src="getCharacterIcon(character.id)" class="character-icon" />
  <div class="character-info">
    <span class="character-name">{{ character.name }}</span>
  </div>
</div>
```

#### `src/composables/useCharacterSearch.ts`
**Size**: ~80 lines
**Purpose**: Character search & filter logic
**Exports**:
```typescript
export const useCharacterSearch = (query: string) => {
  const filtered = computed(() => {
    if (!query) return characterList.value
    const q = query.toLowerCase()
    return characterList.value.filter(char =>
      char.name.toLowerCase().includes(q) ||
      (char.group?.toLowerCase().includes(q))
    )
  })
  
  const grouped = computed(() => {
    // Group filtered characters
  })
  
  return { filtered, grouped }
}
```

#### `src/composables/useCharacterGrouping.ts`
**Size**: ~100 lines
**Purpose**: Group expansion/collapse state
**Exports**:
```typescript
export const useCharacterGrouping = () => {
  const groupExpanded = reactive<Record<string, boolean>>({})
  
  const toggleGroup = (groupName: string) => {
    groupExpanded[groupName] = !groupExpanded[groupName]
  }
  
  const expandAll = () => {
    Object.keys(groupExpanded).forEach(key => {
      groupExpanded[key] = true
    })
  }
  
  const collapseAll = () => {
    Object.keys(groupExpanded).forEach(key => {
      groupExpanded[key] = false
    })
  }
  
  return { groupExpanded, toggleGroup, expandAll, collapseAll }
}
```

### Update Files

#### `src/layouts/LeftSidebar.vue`
**Changes**: Integrate CharacterList and search
```vue
<template>
  <div class="left-sidebar">
    <div class="sidebar-header">
      <h2>Characters</h2>
      <input v-model="searchQuery" type="text" placeholder="Search..." />
    </div>
    <CharacterList :search-query="searchQuery" @select="onSelectCharacter" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CharacterList from '@/components/ui/character/CharacterList.vue'
import { useCharacterStore } from '@/stores/characterStore'

const searchQuery = ref('')
const store = useCharacterStore()

const onSelectCharacter = (id: string) => {
  store.selectedCharacterId = id
}
</script>
```

### Phase 2 Testing Checklist
- [ ] Character list renders
- [ ] Search filters characters
- [ ] Character selection updates store
- [ ] SpineViewer updates on selection
- [ ] Group expand/collapse works
- [ ] Character icons load
- [ ] Scrolling performs smoothly
- [ ] No TypeScript errors

### Phase 2 Deliverables
- ✅ Character list component
- ✅ Search & filter functionality
- ✅ Character selection integration
- ✅ Store integration working

**Estimated Time**: 3-4 hours

---

## Phase 3: Right Sidebar (Animation & Tools)

### What Gets Built
1. Animation tools panel
2. Pose/costume selector
3. Animation list/player controls
4. Export tools panel
5. Background controls

### Files to Create

#### `src/components/ui/AnimationToolsPanel.vue`
**Size**: ~200 lines
**Purpose**: Animation playback and selection controls

**Features**:
- Animation list with search
- Play/pause/seek controls
- Loop toggle
- Speed adjustment (0.5x to 2x)

**Components Used**:
- `PoseSelector.vue`
- `AnimationList.vue`
- `PlaybackControls.vue`

#### `src/components/ui/PoseSelector.vue`
**Size**: ~100 lines
**Purpose**: Pose/costume selection dropdown
**Props**: None (reads from store)
**Emits**: Updates to characterStore

#### `src/components/ui/ExportToolsPanel.vue`
**Size**: ~200 lines
**Purpose**: Export options interface

**Features**:
- Screenshot button
- GIF export with frame count
- Video export (WebM/MP4)
- Frame-by-frame export as ZIP
- Format options (resolution, quality, etc.)

#### `src/components/ui/tools/ScreenshotTool.vue`
**Size**: ~80 lines
**Purpose**: Single frame screenshot

**Functionality**:
```typescript
const takeScreenshot = () => {
  const canvas = getSpineCanvas() // From SpineViewer
  const link = document.createElement('a')
  link.href = canvas.toDataURL()
  link.download = `screenshot_${characterId}_${Date.now()}.png`
  link.click()
}
```

#### `src/components/ui/tools/ExportAnimation.vue`
**Size**: ~150 lines
**Purpose**: Animated export (GIF/WebM)
**Options**:
- Frame range
- Frame rate (15/24/30/60 fps)
- Resolution (original/2x/0.5x)
- Quality (low/medium/high)

#### `src/components/ui/BackgroundControls.vue`
**Size**: ~150 lines
**Purpose**: Background color and image controls

**Features**:
- Color picker
- Transparency slider
- Image upload
- Preset backgrounds

#### `src/composables/useExport.ts`
**Size**: ~200 lines
**Purpose**: Export utilities
**Exports**:
```typescript
export const useExport = () => {
  const exportScreenshot = async (canvas: HTMLCanvasElement, filename?: string) => {}
  
  const exportAsGif = async (frames: ImageData[], options: GifExportOptions) => {}
  
  const exportAsWebM = async (frames: ImageData[], options: VideoExportOptions) => {}
  
  const exportFrameSequence = async (frames: ImageData[], format: 'png' | 'jpg') => {}
  
  return { exportScreenshot, exportAsGif, exportAsWebM, exportFrameSequence }
}
```

### Update Files

#### `src/layouts/RightSidebar.vue`
**Changes**: Populate tab panels with components
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
      <AnimationToolsPanel v-show="activeTab === 'animation'" />
      <ExportToolsPanel v-show="activeTab === 'export'" />
      <BackgroundControls v-show="activeTab === 'background'" />
      <AdvancedToolsPanel v-show="activeTab === 'advanced'" />
    </div>
  </div>
</template>
```

### Phase 3 Testing Checklist
- [ ] Animation tab loads and displays animations
- [ ] Play/pause works
- [ ] Seek bar updates animation time
- [ ] Pose selector works
- [ ] Export button generates file
- [ ] Background color picker works
- [ ] Background image upload works
- [ ] All UI is responsive

### Phase 3 Deliverables
- ✅ Animation tools panel
- ✅ Export tools panel
- ✅ Background controls
- ✅ Export functionality working

**Estimated Time**: 4-5 hours

---

## Phase 4: Center Viewport Enhancement

### What Gets Built
1. Floating zoom controls
2. Layer visibility panel
3. Inspect mode integration
4. Performance monitoring (optional)

### Files to Create

#### `src/components/ui/ZoomControls.vue`
**Size**: ~80 lines
**Purpose**: Zoom in/out/reset buttons
**Methods**:
```typescript
const zoomIn = () => {
  store.zoomLevel = Math.min(store.zoomLevel * 1.2, 4)
}

const zoomOut = () => {
  store.zoomLevel = Math.max(store.zoomLevel / 1.2, 0.1)
}

const resetZoom = () => {
  store.zoomLevel = 1
}
```

#### `src/components/ui/LayerVisibility.vue`
**Size**: ~150 lines
**Purpose**: Toggle layer visibility
**Features**:
- List of layers
- Visibility toggle
- Solo layer
- Hide all / Show all buttons

#### `src/components/ui/InspectModePanel.vue`
**Size**: ~100 lines
**Purpose**: Display inspect mode information
**Info**:
- Current animation time
- Current animation name
- FPS counter
- Layer under cursor (when inspecting)

### Update Files

#### `src/layouts/CenterViewport.vue`
**Changes**: Add overlays and controls
```vue
<template>
  <div class="center-viewport">
    <SpineViewer 
      :mobile-overlay-active="mobileOverlayActive"
      :inspect-mode="inspectMode"
      @update:inspect-mode="inspectMode = $event"
    />
    
    <!-- Floating Controls -->
    <ZoomControls v-if="!mobileOverlayActive" class="floating-controls" />
    <InspectModePanel v-if="inspectMode" class="inspect-panel" />
    
    <!-- Layer Panel (optional drawer) -->
    <LayerVisibilityPanel v-if="showLayerPanel" />
  </div>
</template>
```

### Phase 4 Testing Checklist
- [ ] Zoom buttons work
- [ ] Layer visibility panel renders
- [ ] Layer toggle works
- [ ] Inspect mode displays info
- [ ] All overlays don't obstruct animation
- [ ] Mobile view hides controls properly

### Phase 4 Deliverables
- ✅ Zoom controls
- ✅ Layer visibility panel
- ✅ Inspect mode integration

**Estimated Time**: 2-3 hours

---

## Phase 5: Polish & Refinement

### What Gets Done
1. Keyboard shortcuts
2. Mobile optimization
3. Performance tuning
4. CSS animations and transitions
5. Accessibility review
6. Bug fixes and edge cases

### Files to Create/Enhance

#### `src/composables/useKeyboardShortcuts.ts`
**Size**: ~150 lines
**Shortcuts**:
- `Space`: Play/Pause
- `ArrowLeft/Right`: Seek
- `+/-`: Zoom
- `S`: Screenshot
- `L`: Toggle layers
- `H`: Hide UI
- `C`: Character search focus
- `Escape`: Close modals

#### `src/styles/animations.scss`
**Size**: ~200 lines
**Content**:
- Slide in/out animations
- Fade transitions
- Hover effects
- Transition utilities

#### `src/components/ui/responsive/MobileOptimization.vue`
**Size**: ~100 lines
**Features**:
- Touch event handling
- Gesture support (pinch to zoom)
- Swipe to switch tabs
- Haptic feedback (optional)

### Updates
- [ ] Test on mobile devices (iOS, Android)
- [ ] Optimize bundle size
- [ ] Lazy load heavy components
- [ ] Add loading indicators
- [ ] Error boundary components
- [ ] Accessibility audit (WCAG 2.1)
- [ ] Cross-browser testing

### Phase 5 Testing Checklist
- [ ] Keyboard shortcuts work
- [ ] Mobile layout responsive
- [ ] Touch gestures work
- [ ] No console errors/warnings
- [ ] Performance metrics acceptable
- [ ] Accessibility compliance met
- [ ] Cross-browser compatible

### Phase 5 Deliverables
- ✅ Keyboard shortcuts implemented
- ✅ Mobile optimization complete
- ✅ Performance optimized
- ✅ Accessibility improved
- ✅ Polish applied

**Estimated Time**: 3-4 hours

---

## Summary Timeline

| Phase | Duration | Focus |
|-------|----------|-------|
| 1: Foundation | 2-3 hrs | Layout, structure, theming |
| 2: Left Sidebar | 3-4 hrs | Character selection, search |
| 3: Right Sidebar | 4-5 hrs | Animation, export, backgrounds |
| 4: Viewport | 2-3 hrs | Zoom, layers, inspect |
| 5: Polish | 3-4 hrs | Keyboard, mobile, perf |
| **TOTAL** | **14-19 hrs** | Complete integration |

---

## Development Environment Setup

### Tools Needed
- Vue 3 + Vite
- TypeScript
- Pinia (state management)
- SCSS/SASS
- Naive UI (optional, for consistent UI)

### Key Dependencies
```json
{
  "vue": "^3.3.0",
  "pinia": "^2.1.0",
  "sass": "^1.62.0",
  "typescript": "^5.0.0",
  "@esotericsoftware/spine-player": "^4.0.0"
}
```

### Development Commands
```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run preview   # Preview build
npm run type-check # TypeScript check
npm run lint      # ESLint
```

---

## Architecture Diagrams

### Data Flow
```
User Action
    ↓
Component Event
    ↓
Store Mutation/Action
    ↓
Reactive Update
    ↓
UI Re-render
    ↓
SpineViewer Update
```

### Component Tree
```
App
├── EnhancedLayout
│   ├── LeftSidebar
│   │   └── CharacterList
│   ├── CenterViewport
│   │   ├── SpineViewer (unchanged)
│   │   └── Overlays (Zoom, Inspect)
│   └── RightSidebar
│       ├── AnimationToolsPanel
│       ├── ExportToolsPanel
│       └── BackgroundControls
```

### State Management
```
characterStore (existing)
├── selectedCharacterId
├── selectedAnimation
├── animationCategory
└── ...

uiStateStore (new)
├── layoutMode
├── activeRightTab
├── zoomLevel
└── inspectMode
```

---

## Rollback Strategy

If integration fails:
1. Original files never modified (SpineViewer, stores, etc.)
2. New files are additive only
3. Can simply delete new layout files and revert App.vue
4. Original BrownDust2 functionality remains intact

---

## Success Metrics

✅ All phases complete when:
- [ ] No TypeScript errors
- [ ] All features working as designed
- [ ] Mobile responsive (768px, 1024px, 1200px breakpoints)
- [ ] 60fps animation performance
- [ ] < 3 second initial load
- [ ] Accessibility WCAG 2.1 AA compliant
- [ ] Cross-browser compatible (Chrome, Firefox, Safari, Edge)
- [ ] All unit tests passing

---

## Next Steps After Integration

1. **User Feedback Collection**: Deploy and gather feedback
2. **Performance Monitoring**: Add analytics
3. **Feature Expansion**: Add more BD2-db features
4. **Mobile App**: Consider React Native version
5. **Offline Support**: Service Worker caching
6. **Collaborative Features**: Share/export URLs with animation state

---

## Resource Links

- Vue 3 Docs: https://vuejs.org/
- Pinia: https://pinia.vuejs.org/
- SCSS: https://sass-lang.com/
- Spine Runtime: https://esotericsoftware.com/spine-runtime-guide
- Web APIs: https://developer.mozilla.org/en-US/docs/Web/API
