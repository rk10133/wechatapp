// pages/index/index_components/head/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    index: {
      type: String,
      observer(n, o, path) {
        let value = n < 10 ? '0' + n : n;
        this.setData({
          _index: value
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    year: '',
    month: '',
    _index: '',
    monthArr: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
  },

  /**
   * 组件的生命周期函数
   */

  attached() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    this.setData({
      year,
      month: this.data.monthArr[month]
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})