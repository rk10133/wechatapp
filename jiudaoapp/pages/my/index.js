// pages/my/index.js
import {
  HTTP
} from "../../lib/api"
const http = new HTTP()

import {
  BookRequest
} from "../../lib/book_request/book"
const bookRequest = new BookRequest()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    authorized: false,
    userInfo: {},
    myBookCount: 0,
    classics: null
  },

  onLoad() {
    this.userAuth()
  },

  onShow() {
    this.getMybookCount();
    this.getMyfavor()
  },

  userAuth() {
    wx.getSetting({
      success: r => {
        if (r.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: r => {
              this.setData({
                authorized: true,
                userInfo: r.userInfo
              })
            }
          })
        }
      }
    })
  },

  getUserInfo(e) {
    if (e.detail.userInfo)
      this.setData({
        authorized: true,
        userInfo: e.detail.userInfo
      })
  },

  getMybookCount() {
    bookRequest.getMyBook().then(r => {
      this.setData({
        myBookCount: r.count
      })
    })
  },

  getMyfavor() {
    http.request({
      url: 'classic/favor',
      success: r => {
        this.setData({
          classics: r
        })
      }
    })
  },

  toDetail(e) {
    wx.navigateTo({
      url: `/pages/my_detail/index?cid=${e.detail.cid}&type=${e.detail.type}`
    })
  },
})