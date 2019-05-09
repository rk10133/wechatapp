import {
    HTTP
} from "../../lib/book_request/api_promise"

class KeyWordModel extends HTTP {
    key = 'q'
    maxLength = 10

    getHistory() {
        return wx.getStorageSync(this.key) || []
    }

    getHot() {
        return this.request({
            url: 'book/hot_keyword'
        })
    }

    search(start, q) {
        return this.request({
            url: 'book/search?summary=1',
            data: {
                q: q,
                start: start
            }
        })
    }

    storageSearch(keyword) {
        let words = this.getHistory()
        if (!words.includes(keyword)) {
            if (words.length >= this.maxLength) {
                words.pop()
            }
            words.unshift(keyword)
            wx.setStorageSync(this.key, words)
        } else {
            words.splice(words.indexOf(keyword), 1)
            words.unshift(keyword)
            wx.setStorageSync(this.key, words)
        }
    }
}
export {
    KeyWordModel
}