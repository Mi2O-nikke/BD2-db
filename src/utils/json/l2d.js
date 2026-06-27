const l2dData = [
  
  { 'group': '888', 'name': 'Blanc', 'id': '067104' },

  { 'group': '777', 'name': 'zzz', 'id': 'c270' }
]

const specialClickAnimations = {
}

const customZoomSettings = {
}

const voiceGroupOverrides = {
}

export const charactersWithoutAimAndCover = [
]

const setCustomZoom = (characterId, canvas, transformScale, currentPose) => {
  const zoomKey = currentPose === 'fb' ? characterId : `${characterId}_${currentPose}`

  if (customZoomSettings[zoomKey]) {
    const settings = customZoomSettings[zoomKey] ?? 1
    transformScale = settings.zoom * 1.4

    if (canvas) {
      // Use OrthoCamera zoom via data attributes instead of CSS transforms
      // This prevents blur from CSS scaling by using WebGL native zoom
      canvas.dataset.zoomLevel = transformScale
      canvas.dataset.offsetX = settings.offsetX || 0
      canvas.dataset.offsetY = settings.offsetY || 0
      
      // Store base position for reference
      if (!canvas.dataset.baseLeft) {
        canvas.dataset.baseLeft = canvas.style.left || '0px'
        canvas.dataset.baseTop = canvas.style.top || '0px'
      }

      // Apply camera position updates (no CSS transforms)
      const baseLeft = parseInt(canvas.dataset.baseLeft.replaceAll('px', '')) || 0
      const baseTop = parseInt(canvas.dataset.baseTop.replaceAll('px', '')) || 0

      canvas.style.left = (baseLeft + (settings.offsetX || 0)) + 'px'
      canvas.style.top = (baseTop + (settings.offsetY || 0)) + 'px'
      
      // Trigger camera update with zero transition time for sharp rendering
      if (canvas.__spinePlayer && canvas.__spinePlayer.camera) {
        const camera = canvas.__spinePlayer.camera
        camera.zoom = transformScale
        camera.transitionTime = 0  // No easing/interpolation that could blur
        camera.update()
      }
    }

    return transformScale
  }

  if (canvas) {
    canvas.dataset.baseLeft = ''
    canvas.dataset.baseTop = ''
    canvas.dataset.zoomLevel = '1'
  }

  return transformScale
}

// Since voices are now in public/assets, we need to build the voice map differently
// We'll generate URLs dynamically for each character based on the known structure
const voiceMap = {}

// Helper function to generate voice URLs dynamically
// URLs are generated for all possible lines and the browser/cache will handle which ones exist
const generateVoiceUrls = (voiceFolderId) => {
  const normal = []
  const cover = []
  
  // Normal voices: Generate URLs for lines 1-6 (standard normal voices)
  // The actual files may be less, the error handler will skip missing ones
  for (let i = 1; i <= 6; i++) {
    normal.push(`/assets/voice/${voiceFolderId}/${voiceFolderId}_${i}.mp3`)
  }
  
  // Cover/aim pose voices: Start from 7 onwards (covers lines 7-20)
  // The actual files may be less, the error handler will skip missing ones
  for (let i = 7; i <= 9; i++) {
    cover.push(`/assets/voice/${voiceFolderId}/${voiceFolderId}_${i}.mp3`)
  }
  
  return { normal, cover }
}

// Build voiceMap from l2dData with dynamic URL construction
l2dData.forEach((character) => {
  const characterId = character.id
  
  // Check if this character is in a voice group override
  let voiceFolderId = characterId
  for (const [baseId, variants] of Object.entries(voiceGroupOverrides)) {
    if (Array.isArray(variants) && variants.includes(characterId)) {
      voiceFolderId = baseId
      break
    }
  }
  
  // Generate voice URLs for this character
  const voices = generateVoiceUrls(voiceFolderId)
  voiceMap[characterId] = {
    normal: voices.normal,
    cover: voices.cover
  }
})

export { voiceMap, voiceGroupOverrides, setCustomZoom, customZoomSettings, specialClickAnimations }
export default l2dData