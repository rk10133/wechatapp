// pages/my/index.js
// import {
//   HTTP
// } from "../../lib/api"
// const http = new HTTP()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    authorized: false,
    userInfo: {},
    classics: null
  },

  onLoad() {
    this.userAuth();
  },

  onShow() {},

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
              console.log(this.data)
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


  toDetail(e) {
    // wx.navigateTo({
    //   url: `/pages/my_detail/index?cid=${e.detail.cid}&type=${e.detail.type}`
    // })
  },
})