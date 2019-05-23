// pages/index/index.js
import {
    HTTP
} from "../../lib/api"

const http = new HTTP()

Page({
    data: {
        currentData: null,
        currentPage: 1,
        lastPage: 0
    },

    onLoad() {
        this.readIndex(1);
    },

    readIndex(page) {
        http.request({
            url: `classic/read?limit=1&page=${page}`
        }).then(r => {
            this.setData({
                currentData: r.data[0],
                lastPage: r.last_page,
                currentPage: r.current_page
            });
            wx.setStorageSync('page' + r.current_page.toString(), r.data[0])
        })
    },


    flipPrev() {
        this.flipRequest('preview')
    },

    flipNext() {
        this.flipRequest('next')
    },

    flipRequest(type) {
        let page = type == 'preview' ? (this.data.currentPage + 1) : (this.data.currentPage - 1)
        if (!wx.getStorageSync('page' + page))
            this.readIndex(page)
        else {
            this.setData({
                currentData: wx.getStorageSync('page' + page),
                currentPage: page
            })
        }
    }
})