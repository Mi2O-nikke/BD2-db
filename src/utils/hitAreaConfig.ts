
// export const DEBUG_HIT_AREAS = true
export const DEBUG_HIT_AREAS = false

export interface CharacterCameraConfig {
  zoom?: number
  x?: number
  y?: number
}

//character mode zoom
export const characterModeZoomConfig: Record<string, CharacterCameraConfig> = {
  '021101': { zoom: 0.7, x: 0, y: -150 },
}

//fated guest zoom
export const characterCameraConfig: Record<string, CharacterCameraConfig> = {
  '003892': { zoom: 4.0, x: -100, y: -500 },
  '065193': { zoom: 2.8, x: -10, y: -200 },
  '067104': { zoom: 3.0, x: -100, y: -100 },
}

//motion before idle2 (transition when switching mood)
export const moodMotionConfig: Record<string, string> = {
  '003892': 'motion1_23',
  '065193': 'motion1_11',
  '067104': 'motion1_18',
}

//motion before idle3 (transition when activating love mode)
export const loveMotionConfig: Record<string, string> = {
    '065193': 'motion2_14',
}

//ultimate mode> zoom position + initial motion + click trigger
const clickMotion = (motions: string[], loop: string): [string[], string, number] => [motions, loop, 0]
type UltimateCharacterConfig = [camera: CharacterCameraConfig, initialMotion: string, clickMotions: [string[], string, number]]
export const ultimateCharacterConfig: Record<string, UltimateCharacterConfig> = {
  '003793': [{ zoom: 0.5, x: 0, y: 150 }, 'loop_1', clickMotion(['A_cut', 'B_cut'], 'loop_2')],
  '003892': [{ zoom: 0.4, x: 0, y: 300 }, 'loop', clickMotion(['cut_A', 'cut_B'], 'loop_2')],
  '021101': [{ zoom: 0.57, x: 0, y: -250 }, 'loop', clickMotion(['cut_A', 'cut_B'], 'loop_2')],
  '021201': [{ zoom: 0.35, x: 0, y: -320 }, 'loop', clickMotion(['cut_A', 'cut_B'], 'loop_2')],
  '021291': [{ zoom: 0.38, x: 0, y: -600 }, 'loop', clickMotion(['A_cut', 'B_cut'], 'loop2')],
  '021301': [{ zoom: 0.33, x: 0, y: 100 }, 'loop', clickMotion(['cut_A', 'cut_B'], 'loop_2')],
  '021391': [{ zoom: 0.28, x: 0, y: 0 }, 'loop', clickMotion(['cut_A', 'cut_B'], 'loop_2')],

  '065193': [{ zoom: 0.4, x: 0, y: -100 }, 'loop', clickMotion(['cut_A_all', 'cut_B_all'], 'loop_2')],
  '067104': [{ zoom: 0.4, x: 0, y: -100 }, 'loop_1', clickMotion(['cut_all'], 'loop_2')],
  '067901': [{ zoom: 0.4, x: 0, y: -200 }, 'loop_1', clickMotion(['cut_A_all', 'cut_B_all'], 'loop_2')],
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

// Helper to create hit areas from compact format [x, y, animation]
function createHitAreas(data: Array<[number, number, string]>) {
  const areas: Record<number, { x: number; y: number; animation: string }> = {}
  data.forEach(([x, y, animation], index) => {
    areas[index + 1] = { x, y, animation }
  })
  return areas
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

  '065193': {
    idle1: addDefaultSize(
      createHitAreas([
        [-23, -155, 'mix1_1_long1'],
        [-130, 140, 'mix1_1_long2'],
        [72, 140, 'mix1_1_long3'],
        [-242, -223, 'mix1_1_long4'],
        [185, -166, 'mix1_1_long5'],
        [-128, -54, 'mix1_1_long6'],
        [73, -54, 'mix1_1_long7'],
        [-26, 23, 'mix1_1_long8'],
        [23, -31, 'mix1_1_long9'],
        [-77, -31, 'mix1_1_long10'],
        [-27, -31, 'mix1_1_long11'],
        [126, -442, 'mix1_1_long13'],
        [163, 182, 'mix1_1_long14'],
        [84, -135, 'mix1_1_long16'],
        [-23, -227, 'mix1_1_long18'],
        [-132, -135, 'mix1_1_long20'],
        [-246, -411, 'mix1_2_1'],
        [200, -276, 'mix1_3_1'],
        [-26, 212, 'mix1_10_1'],
        [-77, 76, 'mix1_5_1'],
        [23, 76, 'mix1_6_1'],
        [-26, 76, 'mix1_9_1'],
      ])
    ),
    idle2: addDefaultSize(
      createHitAreas([
        [-170, -156, 'mix2_1_1'],
        [-137, -89, 'mix2_1_2'],
        [-39, -186, 'mix2_2_1'],
        [25, -122, 'mix2_3_1'],
        [55, -3, 'mix2_4_1'],
        [15, -65, 'mix2_6_1'],
        [2, -3, 'mix2_7_1'],
        [107, -3, 'mix2_8_1'],
        [-76, -46, 'mix2_9_1'],
        [140, -51, 'mix2_10_1'],
        [39, 67, 'mix2_11_1'],
        [170, -232, 'mix2_12_1'],
        [187, 51, 'mix2_13_2'],
      ])
    ),
    idle3: addDefaultSize(
      createHitAreas([
        [-65, -35, 'mix3_1_1'],
        [-137, -89, 'mix3_2_1'],
        [-9, -257, 'mix3_3_1'],
        [122, -61, 'mix3_4_1'],
        [41, -90, 'mix3_5_1'],
        [96, 0, 'mix3_6_1'],
        [159, -34, 'mix3_17_1'],
        [-190, -128, 'mix3_9_1'],
        [284, 17, 'mix3_16_1'],
        [70, -41, 'mix3_12_1'],
        [36, 66, 'mix3_13_1'],
        [110, -127, 'mix3_14_1'],
        [270, -92, 'mix3_15_1'],
        [52, 2, 'mix3_18_1'],
        [0, -55, 'mix3_19_1'],
        [65, -231, 'mix3_21_1'],
        [220, -39, 'mix3_22_1'],
        [184, -105, 'mix3_23_1'],
      ])
    ),
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

// Legacy exports for backward compatibility
export const ultimateCameraConfig = Object.fromEntries(
  Object.entries(ultimateCharacterConfig).map(([id, config]) => [id, config[0]])
) as Record<string, CharacterCameraConfig>

export const ultimateMoodMotionConfig = Object.fromEntries(
  Object.entries(ultimateCharacterConfig).map(([id, config]) => [id, config[1]])
) as Record<string, string>

export const ultimateClickMotionConfig = Object.fromEntries(
  Object.entries(ultimateCharacterConfig).map(([id, config]) => [id, config[2]])
) as Record<string, [string[], string, number]>

// Helper to create uniform camera config for multiple animations
const createUniformCameraConfig = (animations: string[], camera: CharacterCameraConfig) => {
  const config: Record<string, CharacterCameraConfig> = {}
  animations.forEach(anim => {
    config[anim] = camera
  })
  return config
}
