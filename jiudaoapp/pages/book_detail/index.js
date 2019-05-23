// pages/book_detail/index.js
import {
  HTTP
} from "../../lib/api"
const http = new HTTP()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    likeStatus: false,
    likeCount: 0,
    comment: [],
    showRealComment: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(option) {
    wx.showLoading();
    let data = {
      where: {
        and: {
          book_id: option.bid
        }
      }
    }
    const detail = http.request({
      url: 'book/read',
      data
    })
    const comment = http.request({
      url: 'comment/read',
      data
    })

    Promise.all([detail,
        comment
      ])
      .then(r => {
        this.setData({
          detail: r[0].data[0],
          comment: r[1].data,
        })
        wx.hideLoading()
      })
  },

  clickCommentArea() {
    this.setData({
      showRealComment: true
    })
  },

  hideRealComment() {
    this.setData({
      showRealComment: false
    })
  },

  commentRequest(e) {

    let content = e.detail.value

    if (!content) {
      return
    }

    if (content.length > 12) {
      wx.showToast({
        title: '评论不可超过12个字',
        icon: 'none'
      })
      return
    };

    let data = {
      book_id: this.data.detail.book_id,
      content
    }

    http.request({
        url: 'comment/create',
        data
      })
      .then(r => {
        wx.showToast({
          title: '评论成功',
          icon: 'none'
        })
      })

    //评论发送后将新添加的评论添加到首位
    this.data.comment.unshift({
      content,
      nums: 1
    })

    //更新评论区显示的评论 
    this.setData({
      comment: this.data.comment,
      showRealComment: false
    })
  }
})