Page({
  data: {
    nowWeather: {},
    nowAddress: {},
    lifeStyle: {},
    bgImg: '',
    bgColor: ''
  },

  onLoad() {
    this.getNow();
  },

  onPullDownRefresh() {
    this.getNow(() => {
      wx.stopPullDownRefresh();
    });
  },

  getNow(callBack) {
    wx.getLocation({
      type: 'gcj02',
      success: r => {
        this.getNowWeather(r);
        this.getNowAddress(r);
      },
      complete: () => {
        callBack && callBack()
      },
      fail: () => {
        wx.showToast({
          title: '未授权使用位置权限，无法获取天气信息',
          icon: 'none',
          duration: 2000
        })
      }
    });
  },
  getNowWeather(location) {
    wx.request({
      url: 'https://free-api.heweather.net/s6/weather',
      data: {
        location: `${location.longitude}` + ',' + `${location.latitude}`,
        key: 'aa05c2fc2a79403f954e51e06faf26b3'
      },
      success: r => {
        // console.log(r.data.HeWeather6[0])
        let url, headBgColor, bgColor;
        switch (r.data.HeWeather6[0].now.cond_code) {
          case '101':
          case '102':
          case '103':
            url = '101'
            bgColor = '#a9daec'
            headBgColor = '#deeef6'
            break;
          case '104':
            url = '102'
            bgColor = '#b6c8cf'
            headBgColor = '#c6ced2'
            break;
          case '300':
          case '301':
          case '302':
          case '303':
          case '304':
          case '305':
            url = '103'
            bgColor = "#a6dde3"
            headBgColor = '#bdd5e1'
            break;
          case '307':
          case '308':
          case '310':
          case '311':
          case '312':
            url = '104'
            bgColor = 'b2c3ca'
            headBgColor = '#c5ccd0'
            break;
          case '400':
          case '401':
          case '402':
          case '403':
          case '404':
            url = '105'
            bgColor = '9cd2e7'
            headBgColor = '#aae1fc'
            break;
          default:
            url = '100'
            bgColor = '#94dce7'
            headBgColor = '#cbeefd'
            break;
        }
        this.setData({
          nowWeather: r.data.HeWeather6[0].now,
          lifeStyle: r.data.HeWeather6[0].lifestyle,
          //根据天气设置背景图片
          bgImg: '../../images/' + url + '.png',
          bgColor: bgColor
        });
        //设置headerBar背景颜色 与天气图片保持一致
        wx.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: headBgColor
        });
      }
    })
  },
  getNowAddress(location) {
    wx.request({
      url: "https://apis.map.qq.com/ws/geocoder/v1",
      data: {
        location: `${location.latitude}` + ',' + `${location.longitude}`,
        key: 'A4XBZ-GQTWX-IHV45-ZTRQH-SQLDF-Q6FMR'
      },
      success: r => {
        this.setData({
          nowAddress: r.data.result.address_component
        });
      }
    })
  }
})