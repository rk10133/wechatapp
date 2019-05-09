const paginationBehav = Behavior({
    data: {
        //searchResult Array
        arr: [],
        total: null
    },

    methods: {
        updateData(arr) {
            let newArr = this.data.arr.concat(arr)
            this.setData({
                arr: newArr
            })
        },

        getCurrentStart() {
            return this.data.arr.length
        },

        setTotal(total) {
            this.setData({
                total
            })
        },

        hasMoreData() {
            if (this.data.arr.length >= this.data.total)
                return false
            return true
        },

        resetArr() {
            this.setData({
                arr: [],
                total: null
            });
        }
    }
})

export {
    paginationBehav
}