# Visual Reference & Component Mockups

## Desktop Layout Mockup

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Brown Dust 2 Enhanced Viewer - Desktop (1200px+)                             │
├────────────────┬─────────────────────────────────┬──────────────────────────┤
│  LEFT SIDEBAR  │       CENTER VIEWPORT           │    RIGHT SIDEBAR         │
│  400px         │         Flexible (1fr)          │      350px               │
├────────────────┼─────────────────────────────────┼──────────────────────────┤
│                │                                 │                          │
│ CHARACTERS     │                                 │ Animation Controls       │
│                │                                 │ ┌──────────────────────┐ │
│ ▼ Group 1      │                                 │ │ ▶ Animation         │ │
│   ┌─────────┐  │                                 │ │ ├─ idle             │ │
│   │ [Icon]  │  │                                 │ │ ├─ walk             │ │
│   │ Char 1  │  │          SpineViewer            │ │ ├─ attack           │ │
│   │ Selected│  │                                 │ │ └─ victory          │ │
│   └─────────┘  │          [Animation]            │ │                      │ │
│                │                                 │ │ ▶ Pose: Normal       │ │
│   ┌─────────┐  │          renders                │ │ ├─ Normal            │ │
│   │ [Icon]  │  │                                 │ │ ├─ Cover             │ │
│   │ Char 2  │  │          here                   │ │ └─ Aim               │ │
│   └─────────┘  │                                 │ │                      │ │
│                │                                 │ │ Play: [▶] [⏸] [⏹]   │ │
│ [Search box]   │                                 │ │ Speed: 1.0x [v]      │ │
│                │    [Zoom +]                     │ │ Loop: [✓]            │ │
│                │    [Inspect]                    │ │                      │ │
│                │    [Layers]                     │ │                      │ │
│                │                                 │ │                      │ │
│                │                                 │ └──────────────────────┘ │
│                │                                 │                          │
│                │                                 │ Export Tools             │
│                │                                 │ ┌──────────────────────┐ │
│                │                                 │ │ [Screenshot] [GIF]   │ │
│                │                                 │ │ [WebM] [Frame Seq]   │ │
│                │                                 │ │ Frames: [30] fps [v] │ │
│                │                                 │ │                      │ │
│                │                                 │ └──────────────────────┘ │
│                │                                 │                          │
│                │                                 │ Background              │
│                │                                 │ ┌──────────────────────┐ │
│                │                                 │ │ Color: [■ #000000] │ │
│                │                                 │ │ Opacity: ████░░░░░░  │ │
│                │                                 │ │ [Upload Image]       │ │
│                │                                 │ │                      │ │
│                │                                 │ └──────────────────────┘ │
│                │                                 │                          │
│                │                                 │ Layers                   │
│                │                                 │ ┌──────────────────────┐ │
│                │                                 │ │ ☑ Layer 1           │ │
│                │                                 │ │ ☑ Layer 2           │ │
│                │                                 │ │ ☐ Layer 3           │ │
│                │                                 │ │ [Show All] [Hide All]│ │
│                │                                 │ │                      │ │
│                │                                 │ └──────────────────────┘ │
│                │                                 │                          │
├────────────────┴─────────────────────────────────┴──────────────────────────┤
│ Seek Bar: [■■■■■■■░░░░░░░░░░░░░░░░░] 00:30 / 02:00                        │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Tablet Layout Mockup

```
┌────────────────────────────────────────────────┐
│ Brown Dust 2 Viewer - Tablet (768-1199px)      │
├────────────────────────────────────────────────┤
│ [☰ Char] | Animation Viewer | [Tools ⚙]      │  ← Header toggle buttons
├────────────────────────────────────────────────┤
│                                                │
│            Characters (Collapsed)              │  ← Sidebar overlay
│            ┌──────────────────────┐            │
│            │ ▼ Group 1            │            │
│            │   Char 1 (selected)  │            │
│            │   Char 2             │            │
│            │ ▼ Group 2            │            │
│            │   Char 3             │            │
│            │   Char 4             │            │
│            │ [Search...]          │            │
│            └──────────────────────┘            │
│                                                │
│                                                │
│                                                │
│           SpineViewer                          │
│           [Animation renders]                  │
│           [Full width center]                  │
│                                                │
│                                                │
│                                                │
├────────────────────────────────────────────────┤
│ [Animation] [Export] [Background] [Advanced]   │  ← Tab navigation
└────────────────────────────────────────────────┘

When "Tools" button tapped:
Sidebar overlays from right, showing:
- Animation controls
- Export options
- Background settings
- Advanced options (layered tabs)
```

---

## Mobile Layout Mockup

```
┌─────────────────────────────────────┐
│ ☰ Brown Dust 2 Viewer               │  ← Header
├─────────────────────────────────────┤
│                                     │
│                                     │
│                                     │
│                                     │
│     SpineViewer                     │
│     [Full width]                    │
│     [Full height]                   │
│                                     │
│                                     │
│                                     │
│                                     │
├─────────┬─────────┬─────────────────┤
│ Charact.│ Tools   │ (More options)   │  ← Tab bar
└─────────┴─────────┴─────────────────┘

When "Charact." tapped:
┌─────────────────────────────────────┐
│ ☰ Brown Dust 2 Viewer               │
├─────────────────────────────────────┤
│ Characters (Full screen overlay)    │
│ [Search...]                         │
│ ▼ Group 1                           │
│   Char 1  ✓                         │
│   Char 2                            │
│   Char 3                            │
│ ▼ Group 2                           │
│   Char 4                            │
│   Char 5                            │
│   Char 6                            │
│ ▼ Group 3                           │
│   Char 7                            │
│                                     │
├─────────┬─────────┬─────────────────┤
│ Charact.│ Tools   │ More            │
└─────────┴─────────┴─────────────────┘

When "Tools" tapped:
┌─────────────────────────────────────┐
│ ☰ Brown Dust 2 Viewer               │
├─────────────────────────────────────┤
│ Tools & Controls (Full screen)      │
│                                     │
│ ▶ Animation                         │
│ ├─ idle                             │
│ ├─ walk                             │
│ ├─ attack                           │
│                                     │
│ [Play] [Pause] [Stop]               │
│                                     │
│ ← Export                            │
│ [Screenshot] [GIF] [WebM]           │
│                                     │
│ ← Background                        │
│ Color: [■] Opacity: ░░░░░░░░        │
│                                     │
├─────────┬─────────┬─────────────────┤
│ Charact.│ Tools   │ More            │
└─────────┴─────────┴─────────────────┘
```

---

## Component Breakdown

### Left Sidebar - Character List

```
┌─────────────────────────────────┐
│ CHARACTERS                      │  ← Sidebar Title
├─────────────────────────────────┤
│ [🔍 Search characters...]       │  ← Search input
├─────────────────────────────────┤
│ ▼ Featured                      │  ← Group header (clickable)
│   ┌────────────────────────────┐│
│   │ 🖼️ [Icon] Character Name   ││  ← Character item
│   │ Rarity: ★★★★★              ││
│   └────────────────────────────┘│
│   ┌────────────────────────────┐│
│   │ 🖼️ [Icon] Character Name   ││
│   │ Rarity: ★★★★                ││
│   └────────────────────────────┘│
│                                 │
│ ▼ Mercenaries (2/4 shown)       │
│   ┌────────────────────────────┐│
│   │ 🖼️ [Icon] Character Name   ││  ← Selected (highlighted)
│   │ Group: Mercenaries          ││
│   └────────────────────────────┘│
│   ┌────────────────────────────┐│
│   │ 🖼️ [Icon] Character Name   ││
│   └────────────────────────────┘│
│                                 │
│ ▶ Special Event (collapsed)      │  ← Collapsed group
│                                 │
│ ▼ Collab (3/10 shown)            │
│   [scrollable area...]          │
│                                 │
└─────────────────────────────────┘
```

---

### Right Sidebar - Tab Panels

```
┌──────────────────────────────┐
│ ▶ Animation │⬇ Export │🎨 BG   │  ← Tab buttons
├──────────────────────────────┤
│                              │
│ ANIMATION CONTROLS           │
│                              │
│ Pose:  [Normal ▼]            │
│ ├─ Normal                    │
│ ├─ Cover                     │
│ └─ Aim                       │
│                              │
│ Animation:                   │
│ └─ idle      ☑              │
│ └─ walk      ☐              │
│ └─ run       ☐              │
│ └─ attack    ☐              │
│ └─ victory   ☐              │
│                              │
│ PLAYBACK CONTROLS            │
│                              │
│ [⏮️] [⏭️] [⏸️] [▶️]           │
│                              │
│ Progress: [████░░░░░░░░░░]  │
│ 00:30 / 02:00                │
│                              │
│ Speed: [1.0x ▼]              │
│ ├─ 0.5x                      │
│ ├─ 1.0x ✓                    │
│ ├─ 1.5x                      │
│ └─ 2.0x                      │
│                              │
│ ☑ Loop                       │
│                              │
└──────────────────────────────┘


┌──────────────────────────────┐
│ ▶ Animation │⬇ Export │🎨 BG   │
├──────────────────────────────┤
│                              │
│ EXPORT OPTIONS               │
│                              │
│ [📷 Screenshot]              │
│ PNG format, current frame    │
│                              │
│ [🎬 Export Animation]        │
│ ┌──────────────────────────┐ │
│ │ Format: [GIF ▼]          │ │
│ │ Resolution: [1x ▼]       │ │
│ │ Frame Rate: [30 fps ▼]   │ │
│ │ Quality: [High ▼]        │ │
│ │ Duration: 60 frames      │ │
│ │ [Export to GIF]          │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ Format: [WebM ▼]         │ │
│ │ Codec: [VP9 ▼]           │ │
│ │ Bitrate: [5Mbps ▼]       │ │
│ │ [Export to WebM]         │ │
│ └──────────────────────────┘ │
│                              │
│ [📦 Frame Sequence]          │
│ Export each frame as PNG     │
│                              │
└──────────────────────────────┘


┌──────────────────────────────┐
│ ▶ Animation │⬇ Export │🎨 BG   │
├──────────────────────────────┤
│                              │
│ BACKGROUND SETTINGS          │
│                              │
│ Color:                       │
│ [■ #000000]  [Choose...]    │
│                              │
│ Opacity:                     │
│ [████████░░░░░░░░░░]  80%   │
│                              │
│ Image:                       │
│ [Upload Image]  [Clear]      │
│ [📁 current_bg.png ✓]        │
│                              │
│ Presets:                     │
│ [White] [Gray] [Black]       │
│ [Transparent]                │
│                              │
│ Position: [Fit ▼]            │
│ ├─ Fit                       │
│ ├─ Stretch                   │
│ ├─ Tile                      │
│ └─ Center                    │
│                              │
└──────────────────────────────┘
```

---

## Left Sidebar - Character Search

```
Normal State:
┌──────────────────────────────┐
│ CHARACTERS                   │
├──────────────────────────────┤
│ [🔍 Search characters...]    │
├──────────────────────────────┤
│ Groups displayed...          │

Search State (typing "rin"):
┌──────────────────────────────┐
│ CHARACTERS                   │
├──────────────────────────────┤
│ [🔍 rin...              ✕]  │
├──────────────────────────────┤
│ Results:                     │
│                              │
│ Featured:                    │
│ ┌────────────────────────────┐
│ │ Rin                        │
│ │ ★★★★★ - Featured Event    │
│ └────────────────────────────┘
│                              │
│ Mercenaries:                 │
│ ┌────────────────────────────┐
│ │ Rinalith                   │
│ │ ★★★ - Mercenary           │
│ └────────────────────────────┘
│                              │
│ (showing 2 of 4 results)     │
│                              │
└──────────────────────────────┘
```

---

## Center Viewport - Floating Controls

```
┌────────────────────────────────────────┐
│                                        │
│                                        │
│           SpineViewer                  │
│                                        │
│     [Floating Toolbar]                 │
│     ┌─────┬─────┬─────┐               │
│     │ − │ │ ↺ │ │ + │                 │  ← Zoom controls
│     └─────┴─────┴─────┘               │
│                                        │
│     [Inspect Panel]                    │
│     ┌───────────────────────────────┐  │
│     │ Animation: idle               │  │
│     │ Time: 00:30 / 02:00           │  │
│     │ FPS: 60                       │  │
│     │ Hovered Layer: armor_slot     │  │
│     └───────────────────────────────┘  │
│                                        │
│                                        │
│                                        │
│ [Seek Bar ████░░░░░░░░░░░░░░░░░░░░]   │
│                                        │
└────────────────────────────────────────┘
```

---

## Responsive Breakpoint Examples

### Desktop (≥1200px)
```
┌─────────┬─────────────────────┬────────┐
│ LEFT    │      CENTER         │ RIGHT  │
│ 400px   │    Flexible (1fr)   │ 350px  │
│         │                     │        │
│ Fixed   │    Fixed            │ Fixed  │
│ Width   │    Height           │ Width  │
└─────────┴─────────────────────┴────────┘
```

### Tablet (768-1199px)
```
┌────────────────────────────────────────┐
│ [Chars] [Center] [Tools ⚙]             │  ← Toggle buttons
├────────────────────────────────────────┤
│ Sidebar                 │              │
│ overlay (300px)         │  Center      │
│                         │  (flexible)  │
│ or                      │              │
│ Center full width       │              │
├────────────────────────────────────────┤
│ [Animation] [Export] [Background] [+]  │
└────────────────────────────────────────┘
```

### Mobile (<768px)
```
┌────────────────────────────┐
│ ☰ App Title                │
├────────────────────────────┤
│                            │
│   Center (Full width)      │
│   SpineViewer              │
│                            │
├────────────────────────────┤
│ [Char] │ [Tools] │ [More]  │  ← Tab bar
└────────────────────────────┘
```

---

## Color Scheme

### Dark Theme (Default)

```
Primary Background:     #1a1a1f (very dark gray)
Secondary Background:   #2a2a2f (dark gray)
Tertiary Background:    #0f0f12 (almost black, for viewport)
Text Primary:           #e0e0e0 (light gray)
Text Secondary:         #999999 (medium gray)
Accent Color:           #00ff00 (bright green)
Accent Hover:           #00dd00 (darker green)
Border Color:           #2a2a2f (same as secondary bg)
Success Color:          #00ff00 (green)
Warning Color:          #ffaa00 (orange)
Error Color:            #ff0000 (red)
```

### CSS Variables

```scss
$bg-primary: #1a1a1f;
$bg-secondary: #2a2a2f;
$bg-tertiary: #0f0f12;
$text-primary: #e0e0e0;
$text-secondary: #999999;
$accent: #00ff00;
$accent-hover: #00dd00;
$border: #2a2a2f;
```

---

## Spacing System

```
xs:  4px  (tight)
sm:  8px  (small padding)
md:  12px (default padding)
lg:  16px (large padding)
xl:  24px (extra large)
2xl: 32px (double large)
```

---

## Typography

```
Font Family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif

Sizes:
- h1: 32px (page titles)
- h2: 24px (section headers)
- h3: 20px (subsection headers)
- h4: 18px (minor headers)
- body: 14px (default text)
- small: 12px (annotations)
- xs: 10px (meta info)

Weights:
- Regular: 400
- Medium: 500 (buttons)
- Semibold: 600 (headers)
- Bold: 700 (emphasis)
```

---

## Animation Timings

```
Fast:      100ms (quick interactions)
Normal:    200ms (standard transitions)
Slow:      300ms (modal reveals)
Slower:    500ms (complex animations)

Easing:
- ease-in: cubic-bezier(0.4, 0, 1, 1)
- ease-out: cubic-bezier(0, 0, 0.2, 1)
- ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
```

---

## Icon Reference

```
Navigation & Basic:
☰ Menu/hamburger
✕ Close
⌫ Back
↻ Refresh/reset
↺ Rotate

Playback:
▶️ Play
⏸️ Pause
⏹️ Stop
⏮️ Previous
⏭️ Next

Tools & Actions:
📷 Screenshot
🎬 Video/Film
⬇️ Download/Export
🎨 Color/Background
⚙️ Settings/Advanced
🔍 Search
📁 File/Upload
☑️ Checkbox (checked)
☐ Checkbox (unchecked)
■ Color selector
★ Star/Rating
```

---

## Hover & Active States

### Button States
```
Default:    background: #2a2a2f, color: #e0e0e0
Hover:      background: #3a3a3f, color: #00ff00
Active:     background: #00ff00, color: #000000
Disabled:   background: #1a1a1f, color: #666666, opacity: 0.5
```

### Link States
```
Default:    color: #00ff00, text-decoration: none
Hover:      color: #00dd00, text-decoration: underline
Active:     color: #00aa00, font-weight: bold
```

### Form States
```
Focus:      border: #00ff00, box-shadow: 0 0 0 2px rgba(0, 255, 0, 0.1)
Error:      border: #ff0000, color: #ff0000
Success:    border: #00ff00, color: #00ff00
Disabled:   background: #1a1a1f, color: #666666, cursor: not-allowed
```

---

## Accessibility Colors

```
High Contrast Mode:
Text on dark bg:    #ffffff (white)
Text on light bg:   #000000 (black)
Accent:             #0055ff (blue, WCAG AAA compliant)

Color Blind Safe:
Primary:            #0173b2 (blue)
Secondary:          #de8f05 (orange)
Accent:             #cc78bc (purple)
```

---

## Z-Index Hierarchy

```
z-index: 1    - Default layer, sidebars, cards
z-index: 10   - Header/navbar
z-index: 20   - Floating controls (zoom buttons)
z-index: 30   - Tooltips
z-index: 40   - Modal overlays
z-index: 50   - Dropdown menus
z-index: 100  - Mobile menu overlay
z-index: 1000 - Toast/notification messages
z-index: 9999 - Emergency (used sparingly)
```

---

## Button Sizes & Variants

```
Large:      32px height, 16px padding
Normal:     28px height, 12px padding (default)
Small:      24px height, 8px padding
Mini:       20px height, 6px padding

Variants:
- Primary:      green accent, solid
- Secondary:    gray, outlined
- Danger:       red, solid
- Ghost:        no background, hover effect
- Icon:         square, icon only
```

---

## This Reference

Use these mockups and specifications when building components to ensure:
- ✅ Consistent layout across all screen sizes
- ✅ Visual hierarchy is clear
- ✅ Colors follow the dark theme
- ✅ Spacing is consistent
- ✅ Interactive elements are properly states
- ✅ Accessibility is maintained
- ✅ Typography is readable
