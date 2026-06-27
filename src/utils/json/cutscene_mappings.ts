export type CutsceneAnim = string | { name: string; offset?: number; source?: string; skin?: string; hold?: boolean }

export type CutsceneComposite = (CutsceneAnim | CutsceneAnim[])[]

export type CutsceneCompositeDefinition = {
  name?: string
  composite?: CutsceneComposite
  animations?: CutsceneComposite
}

export type CutsceneCompositeEntry = CutsceneComposite | CutsceneCompositeDefinition | CutsceneCompositeDefinition[]

const cutsceneComposites: Record<string, CutsceneCompositeEntry> = {
  '067803': [
    {
      name: 'cut_A_all',
      composite: [
        [
          'cut_A_B_Arm',
          'cut_A',
          { name: 'cut_A_B', source: 'cutscene/glow/cutscene_char067803_1' },
          { name: 'cut_A_F', source: 'cutscene/glow/cutscene_char067803_1' }
        ]
      ]
    }
  ],
  '067104': [
    {
      name: "cut_A_all",
      composite: [[
        "cut_A_front_body",
        "cut_A",
        "cut_A_front_arm",
        { name: "cut_A_curtain", hold: true }
      ]]
    },
    {
      name: "cut_A_all/no-curtain",
      composite: [[
        "cut_A_front_body",
        "cut_A",
        "cut_A_front_arm"
      ]]
    }
  ]
}

/**
 * Get default animation for a character (defaults to "cut_A_all")
 */
export const getDefaultAnimation = (characterId: string): string => {
  return 'cut_A_all'
}

/**
 * Check if an animation name is a composite animation for a given character
 */
export const isCompositeAnimation = (characterId: string, animationName: string): boolean => {
  const composites = cutsceneComposites[characterId]
  if (!composites) return false
  
  if (Array.isArray(composites)) {
    return composites.some(c => c.name === animationName)
  }
  return !!(composites[animationName as keyof typeof composites])
}

/**
 * Get the composite animation definition for a character
 */
export const getCompositeAnimation = (characterId: string, animationName: string): CutsceneCompositeDefinition | null => {
  const composites = cutsceneComposites[characterId]
  if (!composites) return null
  
  if (Array.isArray(composites)) {
    return composites.find(c => c.name === animationName) || null
  }
  return composites[animationName as keyof typeof composites] || null
}

/**
 * Parse component animations from a composite definition
 */
export const getComponentAnimations = (composite: CutsceneCompositeDefinition): string[] => {
  const animations: string[] = []
  
  if (composite.composite && Array.isArray(composite.composite)) {
    composite.composite.forEach((group) => {
      if (Array.isArray(group)) {
        group.forEach((anim) => {
          if (typeof anim === 'string') {
            animations.push(anim)
          } else if (anim.name) {
            animations.push(anim.name)
          }
        })
      }
    })
  }
  
  return animations
}

export { cutsceneComposites }
export default cutsceneComposites
