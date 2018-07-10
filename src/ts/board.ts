import { Scene, GameObjects } from 'phaser'
import { gameProps, graphicAssets, levelData, TILE_STATE } from './config'
import Tile from './tile'

export default class Board {
  scene: Scene
  // 行数
  rows: number
  // 列数
  cols: number
  mines: number
  group: GameObjects.Group

  constructor(scene, rows, colums, mines) {
    this.scene = scene
    
    this.rows = rows
    this.cols = colums
    this.mines = mines

    this.group = scene.add.group()
    
    this.init()
  }

  init() {
    let scene = this.scene
    let group = this.group
    let { rows, cols } = this
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let tile = new Tile(this.scene, r, c, graphicAssets.tiles.name, 0, TILE_STATE.DEFAULT, group)
        tile.on('onReveal', this.onReveal, this)
      }
    }

    this.setMines(this.group.getChildren())
  }

  onReveal(curTile) {
    let visited = {}

    if (curTile.currentValue == TILE_STATE.MINE) {
      this.revealAllTiles()
    } else {
      this.revealNormalTiles(curTile, visited)
    }
  }

  revealAllTiles() {
    let tiles = <MineTileSprite[]>this.group.getChildren()

    tiles.forEach((tile) => {
      tile.reveal()
    })
  }

  revealNormalTiles(curTile, visited) {
    let tiles = <MineTileSprite[]>this.group.getChildren()

    this.dfsVisit(curTile, visited)

    Object.keys(visited).forEach((visitedKey) => {
      let [ row, col ] = visitedKey.split('-')
      let index = this.rowCol2Index(row, col)
      tiles[index].reveal()
    })
  }

  dfsVisit(curTile, visited) {
    let { row, col } = curTile
    if (curTile.currentValue === TILE_STATE.ZERO) {
      let surroundingTiles = this.getSurroundingTiles(curTile)
      surroundingTiles.forEach((tile) => {
        let { row, col } = tile
        if (!visited[`${row}-${col}`]) {
          visited[`${row}-${col}`] = 1
          this.dfsVisit(tile, visited)
        }
      })
    } else if (curTile.currentValue <= TILE_STATE.EIGHT) {
      visited[`${row}-${col}`] = 1
    }
  }

  // 移动整个group位置
  moveTo(x, y) {
    let tiles = <MineTileSprite[]>this.group.getChildren()
    
    let { rows, cols } = this
    let { tileWidth, tileHeight } = gameProps
    
    tiles.forEach((tile, index) => {
      // 将tile在tiles的索引位置转为x, y坐标
      let posX = x + index % cols * tileWidth
      let posY = y + Math.floor(index / rows) * tileHeight
      
      // 没有直接操作tile.x, tile.y
      tile.setPosXY(posX, posY)
    })
  }

  private getRandomTile(allTiles) {
    let randomIndex = Phaser.Math.Between(0, allTiles.length - 1)

    return allTiles[randomIndex]
  }

  // 埋雷
  private setMines(allTiles) {
    let randomTile = this.getRandomTile(allTiles)
    let mines = this.mines
    
    for (var i = 0; i < mines; i++) {
      while (randomTile.currentValue == TILE_STATE.MINE) {
        randomTile = this.getRandomTile(allTiles)
      }

      randomTile.currentValue = TILE_STATE.MINE
      this.updateSurroundingTiles(randomTile)
      randomTile = this.getRandomTile(allTiles)
    }
  }

  // 更新雷周围的数字
  private updateSurroundingTiles(tile) {
    let surroundingTiles = this.getSurroundingTiles(tile)
    
    surroundingTiles.forEach((tile) => {
      if (tile.currentValue !== TILE_STATE.MINE) {
        tile.currentValue += 1
      }
    })
  }

  private getSurroundingTiles(tile) {
    let allTiles = <MineTileSprite[]>this.group.getChildren()

    // 左上, 上, 右上, 右, 右下, 下, 左下, 左
    let directions = [
      [-1, -1],
      [0, -1],
      [1, -1],
      [1, 0],
      [1, 1],
      [0, 1],
      [-1, 1],
      [-1, 0]
    ]
    
    let { rows, cols } = this

    let tileList = directions.map((direction) => {
      let row = tile.row + direction[0]
      let col = tile.col + direction[1]
      return { row, col }
    }).filter(({ row, col }) => {
      if (row < 0 || row >= rows || col < 0 || col >= cols) {
        return false
      }
      return true
    }).map(({ row, col }) => {
      let index = this.rowCol2Index(row, col)
      return allTiles[index]
    })

    return tileList
  }

  // 将二维的行列索引位置，转为一维的数组索引位置
  private rowCol2Index(row, col) {
    row = Number(row)
    col = Number(col)
    let { tilesWidth } = levelData
    return row * tilesWidth + col
  }
}