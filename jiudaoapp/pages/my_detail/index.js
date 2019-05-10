// pages/my_detail/index.js
import {
  HTTP
} from "../../lib/api"
const http = new HTTP()

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    currentData: null,
    like: false,
    count: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLoad(option) {
      let cid = option.cid
      let type = option.type
      http.request({
        url: `/classic/${type}/${cid}`,
        success: r => {
          this.setData({
            currentData: r
          })
        }
      })
    },

    sendLikeRequest(e) {
      let status = e.detail.status;
      let url = status == 'like' ? 'like' : 'like/cancel';
      http.request({
        url: url,
        method: 'POST',
        data: {
          art_id: this.data.currentData.id,
          type: this.data.currentData.type
        },
        success: () => {}
      });
    }

  }
})