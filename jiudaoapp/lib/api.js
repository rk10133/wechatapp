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
    request(params) {
        // url, data, method

        if (!params.method)
            params.method = 'GET';

        wx.request({
            url: api.base_url + params.url,
            data: params.data,
            method: params.method,
            header: {
                'content-type': 'application/json',
                'appkey': api.appkey
            },
            success: r => {
                let code = r.statusCode.toString();
                //通过请求返回的statusCode判断是否返回了数据
                //如果有数据返回则将数据返回给success
                if (code.startsWith('2')) {
                    //如果要求执行success回调 则传回success
                    params.success && params.success(r.data)
                }
                //如果未能返回数据则根据error_code进行提示
                else {
                    this._showError(r.data.error_code)
                }
            },
            fail: () => {
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