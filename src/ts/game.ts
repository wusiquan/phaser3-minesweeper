import '../scss/index.scss'
import { Scene } from 'phaser'
import { gameProps, graphicAssets, levelData } from './config'
import Board from './board'

export default class GameScene extends Scene {
  private width: number
  private height: number
  private boardTop: number
  private boardLeft: number

  constructor() {
    super({ key: 'Game' })
  }
  
  init() {
    let config = this.sys.game.config
    this.width = <number>config.width
    this.height = <number>config.height
    this.boardTop = (gameProps.screenHeight - gameProps.tileHeight * levelData.tilesHeight) / 2
    this.boardLeft = (gameProps.screenWidth - gameProps.tileWidth * levelData.tilesWidth) / 2
  }
  
  preload() {
    let tilesAssets = graphicAssets.tiles

    this.load.spritesheet(tilesAssets.name, tilesAssets.url, {
      frameWidth: gameProps.tileWidth,
      frameHeight: gameProps.tileHeight, 
      endFrame: tilesAssets.frames
    })
  }
  
  create() {
    this.initBoard()
    this.initUI()
  }
  
  initBoard() {
    let board = new Board(this, levelData.tilesHeight, levelData.tilesWidth, levelData.totalMines)
    board.moveTo(this.boardLeft, this.boardTop)
  }

  initUI() {}
}