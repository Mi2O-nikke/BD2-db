/**
 * Hit Area Manager
 * Handles hit area visualization and click detection
 */

import type { HitArea, CharacterHitAreas } from './hitAreaConfig'

export interface HitAreaManagerOptions {
  canvas: HTMLCanvasElement
  offsetX?: number
  offsetY?: number
  scale?: number
}

export class HitAreaManager {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D | null = null
  private offsetX: number = 0
  private offsetY: number = 0
  private scale: number = 1
  private areas: HitArea[] = []
  private visible: boolean = false
  private hoveredArea: HitArea | null = null

  constructor(options: HitAreaManagerOptions) {
    this.canvas = options.canvas
    this.offsetX = options.offsetX ?? 0
    this.offsetY = options.offsetY ?? 0
    this.scale = options.scale ?? 1
    
    try {
      this.ctx = this.canvas.getContext('2d')
    } catch (error) {
      console.error('Failed to get 2D context:', error)
    }
  }

  /**
   * Load hit areas for a character
   */
  loadAreas(characterAreas: CharacterHitAreas): void {
    this.areas = Object.values(characterAreas)
  }

  /**
   * Toggle visibility of hit areas
   */
  setVisible(visible: boolean): void {
    this.visible = visible
    if (!visible) {
      this.clearCanvas()
    }
  }

  /**
   * Check if hit areas are visible
   */
  isVisible(): boolean {
    return this.visible
  }

  /**
   * Update canvas dimensions and offsets
   */
  updateCanvas(offsetX: number, offsetY: number, scale: number): void {
    this.offsetX = offsetX
    this.offsetY = offsetY
    this.scale = scale
  }

  /**
   * Get hit area at coordinates
   */
  getHitAreaAtPoint(x: number, y: number): HitArea | null {
    for (const area of this.areas) {
      // Only position scales with camera, size stays fixed
      const worldX = area.x + this.offsetX
      const worldY = area.y + this.offsetY
      const worldWidth = area.width
      const worldHeight = area.height

      if (
        x >= worldX &&
        x <= worldX + worldWidth &&
        y >= worldY &&
        y <= worldY + worldHeight
      ) {
        return area
      }
    }
    return null
  }

  /**
   * Clear canvas
   */
  private clearCanvas(): void {
    if (!this.ctx) return
    try {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    } catch (error) {
      console.warn('Failed to clear canvas:', error)
    }
  }

  /**
   * Draw hit areas on canvas
   */
  draw(): void {
    if (!this.visible || !this.ctx) return

    try {
      this.clearCanvas()

      for (const area of this.areas) {
        // Only position scales with camera, size stays fixed
        const worldX = area.x + this.offsetX
        const worldY = area.y + this.offsetY
        const worldWidth = area.width
        const worldHeight = area.height

        // Always draw as red filled rectangles
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'
        this.ctx.fillRect(worldX, worldY, worldWidth, worldHeight)

        // Draw border
        this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)'
        this.ctx.lineWidth = 2
        this.ctx.strokeRect(worldX, worldY, worldWidth, worldHeight)

        // Draw label (only if not empty)
        if (area.label) {
          this.ctx.fillStyle = 'rgba(255, 255, 255, 1)'
          this.ctx.font = 'bold 12px Arial'
          this.ctx.fillText(area.label, worldX + 5, worldY + 20)
        }
      }
    } catch (error) {
      console.warn('Error drawing hit areas:', error)
    }
  }

  /**
   * Update hovered area
   */
  updateHover(x: number, y: number): void {
    this.hoveredArea = this.getHitAreaAtPoint(x, y)
  }

  /**
   * Clear hovered area
   */
  clearHover(): void {
    this.hoveredArea = null
  }

  /**
   * Get all hit areas
   */
  getAreas(): HitArea[] {
    return [...this.areas]
  }
}
