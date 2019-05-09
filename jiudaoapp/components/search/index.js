// components/search/index.js
import {
  paginationBehav
} from "../../lib/pagination"

import {
  KeyWordModel
} from "./keyword"
const keywordModel = new KeyWordModel()

Component({
  behaviors: [paginationBehav],

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
    hot: [],
    // searchResult: [],
    searchResultTotal: null,
    showSearchResult: false,
    requestPending: false,
    showLoadingIcon: false
  },

  attached() {
    //渲染历史搜索列表
    this.setData({
      history: keywordModel.getHistory()
    })

    //渲染热门搜索列表
    keywordModel.getHot().then(r => {
      this.setData({
        hot: r.hot
      })
    })

  },

  /**
   * 组件的方法列表
   */
  methods: {
    loadMore() {
      if (!this.data.keyword) return;

      //防止短时间内重复请求数据
      if (this.data.requestPending) return;

      let len = this.getCurrentStart();
      if (this.hasMoreData()) {
        this.setData({
          requestPending: true
        })
        keywordModel.search(len, this.data.keyword)
          .then(r => {
            this.updateData(r.books);
            this.setData({
              requestPending: false
            })
          }, fail => {
            //请求失败时也要进行解锁 防止出现死锁
            this.setData({
              requestPending: false
            })
          })
      }
    },

    searchRequest(e) {
      this.setData({
        showSearchResult: true,
        showLoadingIcon: true
      })

      let value = e.detail.value || e.detail.text

      if (e.detail.text) {
        this.setData({
          keyword: e.detail.text
        })
      }

      keywordModel.search(0, value).then(r => {
        //使用pagination中定义的方法更新数据
        this.updateData(r.books);
        this.setTotal(r.total);
        this.setData({
          showLoadingIcon: false
        })
        //缓存搜索历史
        keywordModel.storageSearch(value)
      })
    },

    clearSearchWord(e) {
      //调用pagination中的方法每次搜索前清空数据
      this.resetArr();
      this.setData({
        keyword: '',
        showSearchResult: false
      })
    },

    hideSearchCmp() {
      this.resetArr();
      this.triggerEvent('hide')
    },
  }
})