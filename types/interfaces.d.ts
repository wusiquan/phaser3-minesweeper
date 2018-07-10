/// <reference path="./phaser.d.ts" />

interface MineTileSprite extends Phaser.GameObjects.Sprite {
  row: number,
  col: number
  currentValue: number
  setPosXY(x: number, y: number): void
  reveal(): void
}