
export interface CharacterCameraConfig {
  zoom?: number
  x?: number
  y?: number
}

//fated guest zoom
export const characterCameraConfig: Record<string, CharacterCameraConfig> = {
  '003892': { zoom: 4.0, x: -100, y: -500 },
  '067104': { zoom: 3.0, x: -100, y: -100 },
}

//motion before idle2
export const moodMotionConfig: Record<string, string> = {
  '003892': 'motion1_23',
  '067104': 'motion1_18',
}

// Helper to create uniform camera config for multiple animations
const createUniformCameraConfig = (animations: string[], camera: CharacterCameraConfig) => {
  const config: Record<string, CharacterCameraConfig> = {}
  animations.forEach(anim => {
    config[anim] = camera
  })
  return config
}

//ultimate motion+zoom
export const ultimateClickMotionConfig: Record<string, { default: string; camera?: CharacterCameraConfig; cameraByAnimation?: Record<string, CharacterCameraConfig> }> = {
  '003892': { default: 'cut_A_all', cameraByAnimation: { 'cut_A': { zoom: 2.5, y: 0 } } },
  '067103': { default: 'cut_A_all', cameraByAnimation: { 'cut_A': { zoom: 1.8, y: -250 } } },  
  '067104': { default: 'cut_B_all', cameraByAnimation: createUniformCameraConfig(['cut_A_front_body', 'cut_A', 'cut_A_front_arm', 'cut_A_curtain', 'cut_B'], { zoom: 2.5, y: 0 }) },
}

export const datingSkinOverrideConfig: Record<string, string> = {
  '003892': 'skin2_on',
}

const DEFAULT_SIZE = { width: 50, height: 50 }

export interface HitArea {
  x: number
  y: number
  width: number
  height: number
  animation: string
  label?: string
}

export interface CharacterHitAreas {
  [areaName: string]: HitArea
}

export interface AnimationHitAreas {
  [animationName: string]: CharacterHitAreas
}

export interface HitAreaConfig {
  [characterId: string]: CharacterHitAreas | AnimationHitAreas
}

function addDefaultSize(areas: Record<string, any>, defaultSize: { width: number; height: number } = DEFAULT_SIZE) {
  const result: Record<string, HitArea> = {}
  for (const key in areas) {
    result[key] = {
      ...defaultSize,
      ...areas[key]
    }
  }
  return result
}

const hitAreaConfig: HitAreaConfig = {
  '067104': {
    idle1: addDefaultSize({
      1: { x: 200, y: 60, animation: 'mix1_1_1' },
      2: { x: 40, y: -10, animation: 'mix1_2_1' },
      3: { x: 90, y: -80, animation: 'mix1_3_1' },
      4: { x: -40, y: -120, animation: 'mix1_4_1' },
      5: { x: -40, y: 40, animation: 'mix1_5_1' },
      6: { x: -280, y: -170, animation: 'mix1_6_1' },
      7: { x: -120, y: -330, animation: 'mix1_7_1' },
      8: { x: -100, y: -80, animation: 'mix1_10_1' },
      9: { x: -220, y: -140, animation: 'mix1_11_1' },
      10: { x: -100, y: -270, animation: 'mix1_12_1' },
      11: { x: -100, y: -150, animation: 'mix1_13_1' },
    }),
    idle2: addDefaultSize({
      1: { x: 200, y: 60, animation: 'mix2_1_1' },
      2: { x: 60, y: 0, animation: 'mix2_2_1' },
      3: { x: 130, y: -60, animation: 'mix2_3_1' },
      4: { x: 30, y: -130, animation: 'mix2_4_1' },
      5: { x: -40, y: 40, animation: 'mix2_5_1' },
      6: { x: 90, y: -150, animation: 'mix2_6_1' },
      7: { x: -20, y: -210, animation: 'mix2_30_1' },
      8: { x: -150, y: 350, animation: 'mix2_10_1' },
      9: { x: 380, y: -340, animation: 'mix2_11_1' },
      10: { x: -80, y: -170, animation: 'mix2_15_1' },
      11: { x: -80, y: -250, animation: 'mix2_28_1' },
      12: { x: 60, y: -60, animation: 'mix2_25_1' },
      13: { x: -30, y: -300, animation: 'mix2_26_1' },
      14: { x: 50, y: 60, animation: 'mix2_22_1' },
      15: { x: 170, y: -120, animation: 'mix2_23_1' },
      16: { x: 140, y: 20, animation: 'mix2_24_1' },
      17: { x: -125, y: 140, animation: 'mix2_32_1' },
      18: { x: -110, y: 50, animation: 'mix2_37_1' },
      19: { x: 250, y: -345, animation: 'mix2_38_1' },
    }),
  },

  '003892': {
    idle1: addDefaultSize({
      1: { x: -70, y: -180, animation: 'mix1_9_1' },
      2: { x: 30, y: -180, animation: 'mix1_10_1' },
      3: { x: -110, y: 55, animation: 'mix1_3_1' },
      4: { x: 60, y: 100, animation: 'mix1_4_1' },
      5: { x: -20, y: -180, animation: 'mix1_5_1' },
      6: { x: 60, y: -30, animation: 'mix1_6_1' },
      7: { x: -70, y: 130, animation: 'mix1_7_1' },
      8: { x: 110, y: 110, animation: 'mix1_8_1' },
      9: { x: -20, y: -10, animation: 'mix1_14_1' },
      10: { x: -70, y: -40, animation: 'mix1_18_1' },
      11: { x: -20, y: -60, animation: 'mix1_21_1' },
      12: { x: -15, y: -320, animation: 'mix1_20_2' },
    }),
    idle2: addDefaultSize({
      1: { x: -70, y: -180, animation: 'mix2_12_1' },
      2: { x: 30, y: -180, animation: 'mix2_13_1' },
      3: { x: -20, y: -100, animation: 'mix2_25_1' },
      4: { x: -20, y: -50, animation: 'mix2_36_1' },
      5: { x: -15, y: -320, animation: 'mix2_6_1' },
      6: { x: -20, y: -180, animation: 'mix2_16_1' },
      7: { x: -70, y: -110, animation: 'mix2_9_1' },
      8: { x: -70, y: -20, animation: 'mix2_10_1' },
      9: { x: 90, y: 120, animation: 'mix2_11_1' },
      10: { x: -130, y: -20, animation: 'mix2_17_1' },
      11: { x: 80, y: -50, animation: 'mix2_18_1' },
      12: { x: -20, y: 0, animation: 'mix2_20_1' },
      13: { x: -20, y: 50, animation: 'mix2_26_1' },
      14: { x: 0, y: -270, animation: 'mix2_27_1' },
      15: { x: -120, y: 300, animation: 'mix2_34_1' },
      16: { x: -20, y: 300, animation: 'mix2_38_1' },
    }),
  },
  

}

export default hitAreaConfig
