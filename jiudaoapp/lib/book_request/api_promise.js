const api = {
    base_url: 'http://bl.7yue.pro/v1/',
    appkey: 'AbhC31IG7ruCDp57'
}

const errorTip = {
    1: '请求错误',
    2: '请求失败 请打开调试模式',
    1005: 'appKey无效',
    3000: '期刊不存在'
}

class HTTP {
    request({
        url,
        data = {},
        method = 'GET'
    }) {
        return new Promise((resolve, reject) => {
            this._request(url, resolve, reject, data, method)
        })
    }

    _request(url, resolve, reject, data = {}, method = 'GET') {
        wx.request({
            url: api.base_url + url,
            data,
            method,
            header: {
                'content-type': 'application/json',
                'appkey': api.appkey
            },
            success: r => {
                const code = r.statusCode.toString();
                if (code.startsWith('2')) {
                    resolve(r.data)
                } else {
                    reject();
                    this._showError(r.data.error_code)
                }
            },
            fail: () => {
                reject();
                this._showError(2)
            }
        })
    }

    _showError(error_code) {
        if (!error_code || !errorTip[error_code])
            error_code = 1;
        wx.showToast({
            title: errorTip[error_code],
            icon: 'none',
            duration: 2000
        })
    }
}

export {
    HTTP
}