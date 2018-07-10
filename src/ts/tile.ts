import { GameObjects } from 'phaser'
import { gameProps, TILE_STATE } from './config'

export default class Tile extends GameObjects.Sprite implements MineTileSprite {
  _currentValue: number
  row: number
  col: number
  _posX: number
  _posY: number
  _tweening: boolean
  _tween: Phaser.Tweens.Tween
  _currentState: number
  _clicked: boolean

  constructor(scene, row, col, texture, defaultValue, defaultState, group) {
    let x = col * gameProps.tileWidth
    let y = row * gameProps.tileHeight

    super(scene, x, y, texture, defaultState)

    this.row = row
    this.col = col
    this._currentValue = defaultValue
    this._currentState = defaultState

    // 设置左上角为中心点
    this.setOrigin(0, 0)
    // 将sprite添加到group中, 并显示
    group.add(this, true)

    this.setInteractive()
    this.input.cursor = 'pointer'

    this.on('pointerover', this.rollOver, this)
    this.on('pointerout', this.rollOut, this)
    this.on('pointerdown', this.clickHandler, this)

    // setTimeout(() => {
    //   this.reveal()
    // }, 1000)
  }

  setPosXY(x, y) {
    this.x = x
    this.y = y
    this._posX = x
    this._posY = y
  }

  clickHandler() {
    // TODO: 是否按下shift键
    let flagKey = false

    if (flagKey) {
      this.flag()
    } else {
      this.onReveal()
    }
  }

  flag() {
    let currentState = this._currentState
    if (currentState == TILE_STATE.DEFAULT) {
      currentState = TILE_STATE.FLAG
    } else if (currentState == TILE_STATE.FLAG) {
      currentState = TILE_STATE.UNKNOWN
    } else if (currentState == TILE_STATE.UNKNOWN) {
      currentState = TILE_STATE.DEFAULT
    }
    this._currentState = currentState
    this.setFrame(currentState)
  }

  onReveal() {
    this._clicked = true
    this.emit('onReveal', this)
  }

  reveal() {
    this.setFrame(this._currentValue)

    // 将点击的tile复位到原先的位置
    if (this.x !== this._posX || this.y !== this._posY) {
      this.x = this._posX
      this.y = this._posY
    }

    this.off('pointerdown', this.clickHandler, this, false)
    this.off('pointerover', this.rollOver, this, false)
    if (!this._clicked) {
      this.off('pointerout', this.rollOut, this, false)
    }

    // TODO: interactive
  }

  get currentValue() {
    return this._currentValue
  }

  set currentValue(value) {
    this._currentValue = value
  }

  rollOver() {
    let scene = this.scene

    if (this._tweening) {
      this._tween.stop()
    }

    this._tweening = true
    this._tween = scene.tweens.add({
      targets: this,
      x: this._posX - 3,
      y: this._posY - 3,
      duration: 100,
      ease: 'Quartic.easeOut',
      onComplete() {
        this._tweening = false
      },
      onCompleteScope: this
    })
  }

  rollOut() {
    let scene = this.scene

    if (this._tweening) {
      this._tween.stop()
    }

    if (this._clicked) {
      this.off('pointerout', this.rollOut, this, false)
    }

    this._tweening = true
    this._tween = scene.tweens.add({
      targets: this,
      x: this._posX,
      y: this._posY,
      duration: 100,
      ease: 'Quartic.easeOut',
      onComplete() {
        this._tweening = false
      },
      onCompleteScope: this
    })
  }
}