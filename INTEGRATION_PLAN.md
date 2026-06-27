# BrownDust2 + BD2-db Integration Plan

## Overview
Integrate BD2-db's enhanced UI components (character selection, animation tools, export utilities) with BrownDust2's SpineViewer to create a unified, feature-rich animation viewer.

## Key Principles
1. **SpineViewer Untouched**: Keep `src/components/SpineViewer.vue` as-is (working parallel animations)
2. **Preserve Functionality**: Maintain all existing BrownDust2 features and data flow
3. **Modular Architecture**: Create reusable, focused components
4. **Responsive Design**: Support both desktop and mobile layouts
5. **Progressive Enhancement**: Add BD2-db features without breaking current workflow

---

## File Structure Plan

### NEW FILES TO CREATE

#### 1. **Layout Components** (New: `src/layouts/`)
```
src/layouts/
├── EnhancedLayout.vue          # Main three-column layout wrapper
├── LeftSidebar.vue             # Character selection sidebar
├── CenterViewport.vue          # SpineViewer + overlay controls
└── RightSidebar.vue            # Animation/pose controls sidebar
```

#### 2. **UI Control Components** (New: `src/components/ui/`)
```
src/components/ui/
├── AnimationToolsPanel.vue     # Animation selection & playback controls
├── PoseSelector.vue            # Pose selection dropdown/tabs
├── ExportToolsPanel.vue        # Export, screenshot, format options
├── AttachmentEditor.vue        # Slot/attachment color editor
├── BackgroundControls.vue      # Background color/image controls
├── ZoomControls.vue            # Zoom in/out/fit controls
└── LayerVisibility.vue         # Toggle layer visibility
```

#### 3. **Character Management** (New: `src/components/ui/character/`)
```
src/components/ui/character/
├── CharacterList.vue           # Scrollable character list with search
├── CharacterListItem.vue       # Individual character card
├── CharacterGrouping.vue       # Group expand/collapse logic
└── CharacterSearch.vue         # Search & filter controls
```

#### 4. **Tools/Utilities** (New: `src/components/ui/tools/`)
```
src/components/ui/tools/
├── ScreenshotTool.vue          # Screenshot capture UI
├── ExportAnimation.vue         # Animation export (GIF/video)
├── BackgroundImageUpload.vue   # Image upload handler
├── SkinSelector.vue            # Skin/costume selection
├── QualityToggle.vue           # HQ/LQ asset switcher
└── KeyboardShortcuts.vue       # Keyboard shortcut display
```

#### 5. **Responsive Views** (New: `src/components/ui/responsive/`)
```
src/components/ui/responsive/
├── DesktopView.vue             # Three-column desktop layout
├── TabletView.vue              # Collapsible sidebar tablet view
├── MobileView.vue              # Stacked mobile view
└── ResponsiveBreakpoints.vue   # Breakpoint management composable
```

#### 6. **State Management** (New: `src/stores/`)
```
src/stores/
└── uiStateStore.ts             # New: UI state (panels open/closed, layout prefs)
                                 # (Enhance characterStore.ts for additional needed state)
```

#### 7. **Composables/Utilities** (New: `src/composables/`)
```
src/composables/
├── useAnimationControls.ts     # Animation playback logic
├── useExport.ts                # Export functionality (GIF, video, PNG seq)
├── useCharacterData.ts         # Character loading & caching
├── useLayerVisibility.ts       # Layer show/hide state
├── useResponsiveLayout.ts      # Responsive breakpoint hooks
└── useKeyboardShortcuts.ts     # Keyboard event handling
```

#### 8. **Styling** (New: `src/styles/`)
```
src/styles/
├── layout.css                  # Grid & flexbox layouts
├── components.css              # Reusable component styles
├── responsive.css              # Media query responsive styles
├── animations.css              # Transition & animation utilities
└── theme.css                   # Dark theme variables & overrides
```

---

### EXISTING FILES TO ENHANCE

#### 1. **src/components/SpineViewer.vue**
- ✅ **NO CHANGES** - Keep as-is
- Will be wrapped by `CenterViewport.vue` which provides overlay controls

#### 2. **src/components/CharacterSideBar.vue** (KEEP)
- Refactor into new `src/components/ui/character/` components
- OR: Keep as fallback, create new components for enhanced UI
- Decision: Create NEW enhanced versions, keep original as backup

#### 3. **src/components/AnimationSideBar.vue** (KEEP)
- Extract animation logic into new `AnimationToolsPanel.vue`
- Enhance with BD2-db style controls
- Keep original as-is if needed

#### 4. **src/App.vue** (MODIFY)
- Swap old layout for `EnhancedLayout.vue`
- Update router/navigation if needed
- Keep all existing functionality

#### 5. **src/stores/characterStore.ts** (ENHANCE)
- Add UI state if not present
- Ensure animation tracking works with new components
- No breaking changes

#### 6. **src/main.ts** (MINOR CHANGES)
- Update CSS imports to include new theme/style files
- No breaking changes

---

## Component Hierarchy

```
App.vue
└── EnhancedLayout.vue (RESPONSIVE)
    ├── LeftSidebar.vue
    │   └── CharacterList.vue
    │       ├── CharacterSearch.vue
    │       ├── CharacterGrouping.vue
    │       └── CharacterListItem.vue (x multiple)
    │
    ├── CenterViewport.vue
    │   ├── SpineViewer.vue (UNCHANGED)
    │   ├── ZoomControls.vue (overlay)
    │   ├── SeekBar.vue (existing, kept in SpineViewer)
    │   └── InspectMode.vue (existing, kept in SpineViewer)
    │
    ├── RightSidebar.vue
    │   ├── AnimationToolsPanel.vue
    │   │   ├── PoseSelector.vue
    │   │   └── AnimationList.vue
    │   │
    │   ├── ExportToolsPanel.vue
    │   │   ├── ScreenshotTool.vue
    │   │   ├── ExportAnimation.vue
    │   │   └── ExportOptions.vue
    │   │
    │   ├── BackgroundControls.vue
    │   │   ├── BackgroundImageUpload.vue
    │   │   └── ColorPicker.vue
    │   │
    │   ├── LayerVisibility.vue
    │   │
    │   └── SkinSelector.vue
    │
    └── [Optional] TopBar/BottomBar for additional controls
```

---

## Data Flow & State Management

```
characterStore (Existing)
├── selectedCharacterId
├── selectedAnimation
├── animationCategory
├── layerVisibility
├── backgroundColor
├── customBackgroundImage
└── ... (all existing)

uiStateStore (NEW)
├── leftSidebarCollapsed
├── rightSidebarCollapsed
├── activeTab (animation/export/background)
├── zoomLevel
├── seekBarPosition
└── layoutMode (desktop/tablet/mobile)
```

### State Flow:
1. **Character Selection** → CharacterList → characterStore
2. **Animation Play** → AnimationToolsPanel → characterStore → SpineViewer
3. **Export Request** → ExportToolsPanel → useExport() → File download
4. **Background Change** → BackgroundControls → characterStore → SpineViewer
5. **Layer Toggle** → LayerVisibility → characterStore → SpineViewer

---

## Feature Mapping

| Feature | Source | Implementation |
|---------|--------|-----------------|
| Character List | BD2-db | CharacterList.vue + grouping logic |
| Animation Selection | BrownDust2 | Enhance AnimationToolsPanel |
| Pose/Costume Selector | BD2-db | PoseSelector.vue |
| Screenshot/Export | BD2-db | ScreenshotTool + ExportAnimation |
| Attachment Editor | BD2-db | AttachmentEditor.vue (enhanced) |
| Background Controls | BD2-db | BackgroundControls.vue |
| Layer Visibility | BrownDust2 | LayerVisibility.vue (from SpineViewer logic) |
| Keyboard Shortcuts | BD2-db | useKeyboardShortcuts.ts |
| Quality Toggle | BD2-db | QualityToggle.vue |
| Mobile Responsive | Both | ResponsiveLayout wrapper |

---

## Implementation Phases

### Phase 1: Structure & Layout
- Create EnhancedLayout.vue with three-column grid
- Create responsive view components (Desktop/Tablet/Mobile)
- Update App.vue to use new layout
- Create basic composables

### Phase 2: Left Sidebar (Character Selection)
- Build CharacterList + CharacterListItem components
- Implement search/filter functionality
- Add character grouping logic
- Wire to characterStore

### Phase 3: Right Sidebar (Animation & Tools)
- Build AnimationToolsPanel.vue
- Build PoseSelector.vue
- Build ExportToolsPanel.vue (screenshot + export)
- Build BackgroundControls.vue

### Phase 4: Center Viewport Enhancement
- Wrap SpineViewer in CenterViewport.vue
- Add ZoomControls.vue overlay
- Add LayerVisibility.vue panel
- Add InspectMode integration

### Phase 5: Refinement & Polish
- Add keyboard shortcuts
- Implement keyboard event handling
- Mobile optimization
- Performance tuning
- CSS animation polish

---

## Key Design Decisions

### 1. **Preserve SpineViewer.vue**
- ✅ Wrapped in CenterViewport.vue, not modified
- Maintains current animation logic, parallel track support
- All rendering stays intact

### 2. **BD2-db Component Patterns**
- Use Naive UI components (n-card, n-button, n-scrollbar, etc.)
- Match visual style: Dark theme, green accents (#00FF00 or similar)
- Reuse color picker, export tools, attachment editor patterns

### 3. **State Management**
- Extend existing characterStore rather than replace
- Add new uiStateStore for UI-specific state
- Keep data normalized and reactive

### 4. **Responsive Design**
- Desktop (1200px+): Three-column layout
- Tablet (768px-1199px): Collapsible sidebars
- Mobile (<768px): Stacked, tab-based view

### 5. **Performance**
- Lazy load character images
- Cache exported files
- Virtualize long lists (if 100+ characters)
- Debounce search input

---

## File Count Summary

| Category | Count | Purpose |
|----------|-------|---------|
| Layout Components | 4 | Responsive structure |
| UI Control Components | 7 | Main tool panels |
| Character Components | 4 | Character selection |
| Tool Components | 6 | Screenshot, export, etc. |
| Responsive Views | 4 | Breakpoint handling |
| Composables | 6 | Business logic |
| Styles | 5 | CSS organization |
| **NEW TOTAL** | **36** | Files to create/enhance |

---

## Compatibility Notes

✅ **Compatible with:**
- Existing BrownDust2 data (character IDs, animations, skins)
- Existing SpineViewer functionality (parallel animations, inspect mode)
- BD2-db asset paths and data structures
- Vue 3 Composition API
- Tailwind CSS + Naive UI

⚠️ **Considerations:**
- Mobile viewport handling (ensure touch events work)
- Asset loading paths may differ between projects
- Potential CSS conflicts between Tailwind & Naive UI (use specificity)
- Export functionality depends on spine-player library version

---

## Next Steps

1. ✅ **Approval of this plan**
2. Start Phase 1: Create EnhancedLayout.vue and responsive structure
3. Implement basic three-column grid
4. Start Phase 2: Build character list components
5. Test integration with existing SpineViewer
6. Iteratively build remaining components

---

## Success Criteria

- [ ] Three-column layout renders without errors
- [ ] SpineViewer displays unchanged in center
- [ ] Character list loads and selection works
- [ ] Animation controls play/pause animations
- [ ] Export tools generate files
- [ ] Mobile view works on small screens
- [ ] No console errors
- [ ] Performance acceptable (60fps animations)
- [ ] All existing BrownDust2 features still work
