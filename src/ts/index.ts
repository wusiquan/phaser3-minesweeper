/// <reference path="../../types/interfaces.d.ts" />
import GameScene from './game'
import { Game } from 'phaser'
import { gameProps } from './config'

let gameConfig = {
  type: Phaser.AUTO,
  parent: 'minesweeper',
  width: gameProps.screenWidth,
  height: gameProps.screenHeight,
  scene: [ GameScene ],
  backgroundColor: 0x000000,
  // transparent: true,
  banner: false
}

new Game(gameConfig)