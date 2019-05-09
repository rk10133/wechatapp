import {
    HTTP
} from "./api_promise"

class BookRequest extends HTTP {

    //获取书单信息
    getHotList() {
        return this.request({
            url: 'book/hot_list'
        })
    }

    //获取书籍详情
    getBookDetail(bid) {
        return this.request({
            url: `book/${bid}/detail`
        })
    }

    //获取书籍的点赞状态
    getBookLikeStatus(bid) {
        return this.request({
            url: `book/${bid}/favor`
        })
    }

    //获取书籍的评论信息
    getBookComment(bid) {
        return this.request({
            url: `book/${bid}/short_comment`
        })
    }

    //发送评论
    sendBookComment(bid, content) {
        return this.request({
            url: 'book/add/short_comment',
            method: 'POST',
            data: {
                book_id: bid,
                content: content
            }
        })
    }

    getMyBook() {
        return this.request({
            url: 'book/favor/count'
        })
    }

}

export {
    BookRequest
}