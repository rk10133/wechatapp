// pages/book/index.js
import {
  BookRequest
} from "../../lib/book_request/book"

const bookRequest = new BookRequest()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookList: [],
    showSearchCmp: false,
    reachBottomSignal: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    bookRequest.getHotList().then(r => {
      this.setData({
        bookList: r
      })
    })
  },

  clickSearchArea() {
    this.setData({
      showSearchCmp: true
    })
  },

  hideSearch() {
    this.setData({
      showSearchCmp: false
    })
  },

  //当book页面触底时生成一个字符串传递给search组件
  //在search组件内通过监听字符串的变化发送loadMore请求
  onReachBottom() {
    this.setData({
      reachBottomSignal: Math.random().toFixed(5).toString()
    })
  }
})