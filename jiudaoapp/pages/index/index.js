// pages/index/index.js
import {
    HTTP
} from "../../lib/api"

const http = new HTTP()

Page({
    data: {
        currentData: null,
        first: false,
        latest: true
    },

    onLoad() {
        this.getLatest();
    },

    getLatest() {
        http.request({
            url: 'classic/latest',
            success: r => {
                this.setData({
                    currentData: r,
                });
                this._storageLatestIndex(r.index);

                // 缓存首页数据
                let key = this._setIndexKey(r.index);
                wx.setStorageSync(key, r)
            }
        });
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
            success: () => {
                //点赞请求成功后删除缓存的数据
                wx.removeStorage({
                    key: `index${this.data.currentData.index}`,
                })
            }
        });
    },

    updateLikeStatus() {
        http.request({
            url: `classic/${type}/${this.data.currentData.id}`,
        })
    },

    flipPrev() {
        this.flipRequest('previous')
    },

    flipNext() {
        this.flipRequest('next')
    },

    flipRequest(type) {
        let index = this.data.currentData.index;

        //先在LocalStorage中寻找是否缓存过数据 如果有缓存数据直接读取 如果没有缓存数据再请求数据
        let key = type === 'next' ? this._setIndexKey(index + 1) : this._setIndexKey(index - 1);
        let indexData = wx.getStorageSync(key);

        if (!indexData) {
            http.request({
                url: `classic/${index}/${type}`,
                success: r => {
                    this.setData({
                        currentData: r,
                        first: this.checkFirst(r.index),
                        latest: this.checkLatest(r.index),

                    });
                    //将请求的首页数据进行缓存
                    wx.setStorageSync(this._setIndexKey(r.index), r)
                }
            })
        } else {
            this.setData({
                currentData: indexData,
                first: this.checkFirst(indexData.index),
                latest: this.checkLatest(indexData.index),
            })
        }

    },


    //判断当前是否为最后一期/第一期
    checkFirst(currentIndex) {
        return currentIndex === 1 ? true : false
    },

    //判断当前是否为最新一期
    checkLatest(currentIndex) {
        let latestIndex = this._getLatestIndex();
        return currentIndex === latestIndex ? true : false
    },

    //缓存首次请求到的最新一期数据的index 
    //通过最新一期index来设置上翻页按钮的状态
    _storageLatestIndex(index) {
        wx.setStorageSync('latest', index)
    },

    //读取第一次请求数据缓存的index
    _getLatestIndex() {
        return wx.getStorageSync('latest')
    },

    _setIndexKey(index) {
        let key = 'index' + index;
        return key
    }
})