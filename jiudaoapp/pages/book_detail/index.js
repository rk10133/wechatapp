// pages/book_detail/index.js
import {
  BookRequest
} from "../../lib/book_request/book"
const bookRequest = new BookRequest()

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

    const detail = bookRequest.getBookDetail(option.bid)
    const comment = bookRequest.getBookComment(option.bid)
    const like = bookRequest.getBookLikeStatus(option.bid)

    Promise.all([detail, comment, like])
      .then(r => {
        this.setData({
          detail: r[0],
          comment: r[1].comments,
          likeStatus: r[2].like_status,
          likeCount: r[2].fav_nums
        })
        wx.hideLoading()
      })
  },

  sendLikeRequest(e) {
    let status = e.detail.status;
    let url = status == 'like' ? 'like' : 'like/cancel';
    http.request({
      url: url,
      method: 'POST',
      data: {
        art_id: this.data.detail.id,
        type: 400
      },
    });
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
    //e.detail.text: 用户点击短评提交评论
    //e.detail.value: 用户输入评论
    let content = e.detail.text || e.detail.value

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

    bookRequest.sendBookComment(this.data.detail.id, content)
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