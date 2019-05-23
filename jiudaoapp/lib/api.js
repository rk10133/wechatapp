const baseData = {
    base_url: 'https://mock.biaoyansu.com/api/1/',
    appKey: 'd47d95b9348ad8377a5970de50c2b83ebbb570262779c0107da1ba1630501eee',
    timestamp: Date.now()
}

class HTTP {
    request({
        url,
        data = {}
    }) {
        return new Promise((resolve, reject) => {
            this._request(url, resolve, reject, data)
        })
    }

    _request(url, resolve, reject, data = {}) {
        wx.request({
            url: baseData.base_url + url,
            data,
            method: 'POST',
            header: {
                'BIAO-MOCK-APP-KEY': baseData.appKey,
                'BIAO-MOCK-TIMESTAMP': baseData.timestamp,
                'BIAO-MOCK-SIGNATURE': this._sign(baseData.appKey, baseData.timestamp)
            },
            success: r => {
                const code = r.statusCode.toString();
                if (code.startsWith('2')) {
                    resolve(r.data)
                } else {
                    reject();
                    this._showError('请求错误')
                }
            },
            fail: () => {
                reject();
                this._showError('请求失败')
            }
        })
    }

    _showError(title) {
        wx.showToast({
            title,
            icon: 'none',
            duration: 2000
        })
    }

    _sign(appKey, timestamp) {
        return this._btoa(appKey + timestamp);
    }

    _btoa(str) {
        var c1, c2, c3;
        var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var i = 0,
            len = str.length,
            strin = '';
        while (i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if (i == len) {
                strin += base64EncodeChars.charAt(c1 >> 2);
                strin += base64EncodeChars.charAt((c1 & 0x3) << 4);
                strin += "==";
                break;
            }
            c2 = str.charCodeAt(i++);
            if (i == len) {
                strin += base64EncodeChars.charAt(c1 >> 2);
                strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                strin += base64EncodeChars.charAt((c2 & 0xF) << 2);
                strin += "=";
                break;
            }
            c3 = str.charCodeAt(i++);
            strin += base64EncodeChars.charAt(c1 >> 2);
            strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            strin += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
            strin += base64EncodeChars.charAt(c3 & 0x3F)
        }
        return strin
    }
}

export {
    HTTP
}



// const api = {
//     base_url: 'http://bl.7yue.pro/v1/',
//     appkey: 'AbhC31IG7ruCDp57'
// }

// const errorTip = {
//     1: '请求错误',
//     2: '请求失败 请打开调试模式',
//     1005: 'appKey无效',
//     3000: '期刊不存在'
// }

// class HTTP {
//     request(params) {
//         // url, data, method

//         if (!params.method)
//             params.method = 'GET';

//         wx.request({
//             url: api.base_url + params.url,
//             data: params.data,
//             method: params.method,
//             header: {
//                 'content-type': 'application/json',
//                 'appkey': api.appkey
//             },
//             success: r => {
//                 let code = r.statusCode.toString();
//                 //通过请求返回的statusCode判断是否返回了数据
//                 //如果有数据返回则将数据返回给success
//                 if (code.startsWith('2')) {
//                     //如果要求执行success回调 则传回success
//                     params.success && params.success(r.data)
//                 }
//                 //如果未能返回数据则根据error_code进行提示
//                 else {
//                     this._showError(r.data.error_code)
//                 }
//             },
//             fail: () => {
//                 this._showError(2)
//             }
//         })
//     }

//     _showError(error_code) {
//         if (!error_code || !errorTip[error_code])
//             error_code = 1;
//         wx.showToast({
//             title: errorTip[error_code],
//             icon: 'none',
//             duration: 2000
//         })
//     }
// }

// export {
//     HTTP
// }