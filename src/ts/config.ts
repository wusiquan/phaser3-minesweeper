export const gameProps = {
  // 屏幕宽, 高
  screenWidth: 640,
  screenHeight: 480,
  
  tileWidth: 32,
  tileHeight: 32
}

export let levelData = {
  // 格子区宽9格, 高9格
  tilesWidth: 9,
  tilesHeight: 9,
  
  // 总雷数
  totalMines: 10
}

export const graphicAssets = {
  tiles: { url: 'src/images/tiles.png', name: 'tiles', frames: 14 }
}

export const fontStyles = {
  counterFontStyle: { font: '20px Arial', fill: '#FFFFFF' }
}

export const TILE_STATE = {
  ZERO: 0,
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
  SIX: 6,
  SEVEN: 7,
  EIGHT: 8,
  DEFAULT: 9,
  FLAG: 10,
  WRONG_FLAG: 11,
  UNKNOWN: 12,
  MINE: 13
}