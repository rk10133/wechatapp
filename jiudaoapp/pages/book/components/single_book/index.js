// pages/book/components/single_book/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    book: Object
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
    clickBook() {
      wx.navigateTo({
        url: `/pages/book_detail/index?bid=${this.properties.book.book_id}`
      })
    }
  }
})