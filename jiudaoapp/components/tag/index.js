// components/tag/index.js
Component({
  //启用slot插槽
  options: {
    multipleSlots: true
  },

  /**
   * 组件的属性列表
   */
  properties: {
    text: String
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickShortComment() {
      this.triggerEvent('tapTag', {
        text: this.properties.text
      })
    }
  }
})