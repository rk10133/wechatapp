// pages/index/components/flip/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: String,
    isFirst: Boolean,
    isLatest: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    leftAngle: '../images/triangle@left.png',
    leftAngleDis: '../images/triangle.dis@left.png',
    rightAngle: '../images/triangle@right.png',
    rightAngleDis: '../images/triangle.dis@right.png'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickLeft() {
      if (!this.properties.isLatest)
        this.triggerEvent('left')
    },
    clickRight() {
      if (!this.properties.isFirst)
        this.triggerEvent('right')
    }
  }
})