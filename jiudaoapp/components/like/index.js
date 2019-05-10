// pages/index/components/like/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    liked: Boolean,
    count: Number,
    readOnly: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    likeImg: '../images/like.png',
    likedImg: '../images/liked.png',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tapLike() {
      if (this.properties.readOnly) return
      let liked = this.properties.liked;
      let count = this.properties.count;
      liked ? count = count - 1 : count = count + 1;
      this.setData({
        liked: !liked,
        count
      })

      let status = this.properties.liked ? 'like' : 'cancel';
      this.triggerEvent('updateLikeStatus', {
        status
      })

    }
  }
})