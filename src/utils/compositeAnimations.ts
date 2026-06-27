/**
 * Composite Animation Rendering Utilities
 * Extracted and simplified from BrownDust2 SpineViewer for use in Loader.vue
 */

import type { AnimationState, TrackEntry, Skeleton, Animation } from '@esotericsoftware/spine-webgl'

export type CompositeSegment = {
  track: number
  start: number
  duration: number
  name: string
  additive: boolean
  source: string | null
  skin?: string
  hold?: boolean
  holdUntil?: number
}

export type CutsceneAnim = string | { name: string; offset?: number; source?: string; skin?: string; hold?: boolean }
export type CutsceneComposite = (CutsceneAnim | CutsceneAnim[])[]

/**
 * Get animation name from spec
 */
export function getAnimSpecName(spec: CutsceneAnim): string {
  return typeof spec === 'string' ? spec : spec.name
}

/**
 * Get animation offset from spec
 */
export function getAnimSpecOffset(spec: CutsceneAnim): number {
  return typeof spec === 'string' ? 0 : spec.offset ?? 0
}

/**
 * Get animation source from spec
 */
export function getAnimSpecSource(spec: CutsceneAnim): string | null {
  if (typeof spec === 'string') return null
  return spec.source ?? null
}

/**
 * Get animation duration
 */
export function getAnimDuration(state: AnimationState | null | undefined, name: string): number {
  const anim = state?.data.skeletonData.animations.find((animation: Animation) => animation.name === name)
  return anim?.duration ?? 0
}

/**
 * Get segment end time
 */
export function getCompositeSegmentEnd(segment: CompositeSegment, includeHold = true): number {
  return includeHold && typeof segment.holdUntil === 'number'
    ? segment.holdUntil
    : segment.start + segment.duration
}

/**
 * Build composite schedule - determines timing of all animations
 */
export function buildCompositeSchedule(
  mapping: CutsceneComposite,
  state: AnimationState | null | undefined,
): { schedule: CompositeSegment[]; duration: number } {
  const schedule: CompositeSegment[] = []
  let phaseStart = 0

  for (const segment of mapping) {
    if (Array.isArray(segment)) {
      // Animations in same array play simultaneously
      let longest = 0
      const phaseSegments = segment.map((animSpec, index) => {
        const name = getAnimSpecName(animSpec)
        const offsetValue = getAnimSpecOffset(animSpec)
        const source = getAnimSpecSource(animSpec)
        const skin = typeof animSpec === 'string' ? undefined : animSpec.skin
        const hold = typeof animSpec === 'string' ? false : animSpec.hold === true
        const duration = getAnimDuration(state, name)
        const start = phaseStart + offsetValue
        if (duration + offsetValue > longest) longest = duration + offsetValue
        return { track: index, start, duration, name, additive: true, source, skin, hold }
      })
      const phaseEnd = phaseStart + longest
      phaseSegments.forEach(seg => {
        schedule.push(seg.hold ? { ...seg, holdUntil: phaseEnd } : seg)
      })
      phaseStart += longest
    } else {
      // Single animation queues after previous
      const name = getAnimSpecName(segment)
      const offsetValue = getAnimSpecOffset(segment)
      const source = getAnimSpecSource(segment)
      const skin = typeof segment === 'string' ? undefined : segment.skin
      const hold = typeof segment === 'string' ? false : segment.hold === true
      const duration = getAnimDuration(state, name)
      const start = phaseStart + offsetValue
      schedule.push({ track: 0, start, duration, name, additive: false, source, skin, hold })
      phaseStart += Math.max(duration + offsetValue, 0)
    }
  }

  const duration = schedule.reduce((max, seg) => Math.max(max, seg.start + seg.duration), 0)
  return { schedule, duration }
}

/**
 * Apply composite segments to animation state and skeleton
 * For PARALLEL playback - set all active animations on different tracks at current time
 */
export function applySegmentsToState(
  state: AnimationState,
  skeleton: Skeleton,
  segments: CompositeSegment[],
  time: number,
): void {
  state.clearTracks()
  skeleton.setToSetupPose()
  skeleton.setSlotsToSetupPose()
  skeleton.updateWorldTransform()
  
  if (!segments.length) return

  // Find all segments that should be playing at this time
  const activeSegments = segments.filter(seg => {
    const start = seg.start || 0
    const end = seg.start + seg.duration
    return time >= start && time < end
  })

  // Set each active animation on its own track for parallel playback
  activeSegments.forEach((seg, trackIndex) => {
    const segmentElapsed = Math.max(0, time - seg.start)
    const entry = state.setAnimation(trackIndex, seg.name, false)
    if (entry) {
      entry.mixDuration = 0
      entry.mixTime = 0
      entry.trackTime = segmentElapsed
      entry.trackLast = segmentElapsed
      entry.nextTrackLast = segmentElapsed
    }
  })

  // Apply all animations to skeleton
  state.apply(skeleton)
  skeleton.updateWorldTransform()
}
