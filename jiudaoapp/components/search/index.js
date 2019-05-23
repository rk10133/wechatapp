// components/search/index.js
import {
  HTTP
} from "../../lib/api"
const http = new HTTP()

Component({

  /**
   * 组件的属性列表
   */
  properties: {
    signal: {
      type: String,
      observer: 'loadMore'
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    keyword: '',
    history: [],
    searchResult: [],
    showSearchResult: false,
    showCenterLoadingIcon: false,
    showBottomLoadingIcon: false,
    currentPage: 1,
    lastPage: 0,
    key: 'q',
  },

  attached() {
    //渲染历史搜索列表
    this.setData({
      history: this.getHistory('q')
    })

  },

  /**
   * 组件的方法列表
   */
  methods: {

    loadMore() {
      if (!this.data.keyword) return
      if (this.data.currentPage == this.data.lastPage) return
      this.setData({
        pending: true,
        showBottomLoadingIcon: true,
      })

      this.serachRequest(this.data.keyword, this.data.currentPage + 1).then(r => {
        this.updateSearchResult(r.data)
        this.setData({
          pending: false,
          currentPage: r.current_page,
          showBottomLoadingIcon: false
        })
      }).catch(() => {
        this.setData({
          pending: false,
          showBottomLoadingIcon: false,
        })
      })


    },

    search(e) {
      let value = e.detail.value || e.detail.text
      if (!value) return;


      if (this.data.pending) return
      this.setData({
        searchResult: [],
        showSearchResult: true,
        pending: true,
        showCenterLoadingIcon: true,
        keyword: value
      })

      this.serachRequest(value, 1).then(r => {
        this.updateSearchResult(r.data)
        this.setData({
          pending: false,
          showCenterLoadingIcon: false,
          lastPage: r.last_page,
          currentPage: r.current_page
        })
      }).catch(() => {
        this.setData({
          pending: false,
          showCenterLoadingIcon: false,
        })
      })

      this.storageSearch(value)
    },

    serachRequest(value, page) {
      return http.request({
        url: 'book/read',
        data: {
          where: {
            or: [
              ["title", "=", value],
              ["author", "=", value]
            ]
          },
          page,
          limit: 6
        }
      })
    },


    hideSearchCmp() {
      this.setData({
        showSearchResult: false,
        keyword: '',
        searchResult: []
      })
      this.triggerEvent('hide')
    },

    clearSearchWord() {
      if (this.data.pending) return
      this.setData({
        keyword: ''
      })
    },

    storageSearch(keyword) {
      let words = this.getHistory('q') || []
      if (!words.includes(keyword)) {
        if (words.length >= 10) {
          words.pop()
        }
        words.unshift(keyword)
        wx.setStorageSync('q', words)
      } else {
        words.splice(words.indexOf(keyword), 1)
        words.unshift(keyword)
        wx.setStorageSync('q', words)
      }
      this.setData({
        history: words
      })
    },

    updateSearchResult(arr) {
      let newArr = this.data.searchResult.concat(arr)
      this.setData({
        searchResult: newArr
      })
    },

    getHistory() {
      return wx.getStorageSync('q') || []
    },

    clearSearchHistory() {
      wx.removeStorageSync('q');
      this.setData({
        history: []
      })
    }
  }
})