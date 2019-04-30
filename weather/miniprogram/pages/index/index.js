Page({
  data: {
    location: {},
    nowWeather: {},
    nowAddress: {},
    lifeStyle: {},
    forecast: {},
    bgImg: '',
    bgColor: '',
    weatherIcon: '',
    air: {},
    airColor: '',
    showAir: true
  },

  onLoad() {
    this.getNow();
  },

  onPullDownRefresh() {
    this.getNowWeather(this.data.location, () => {
      wx.stopPullDownRefresh();
    })
  },

  getNow(callBack) {
    wx.getLocation({
      type: 'gcj02',
      success: r => {
        this.getNowWeather(r, callBack);
        this.getNowAddress(r);
        this.setData({
          location: r
        })
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
  getNowWeather(location, callBack) {
    wx.request({
      url: 'https://free-api.heweather.net/s6/weather',
      data: {
        location: location.longitude + ',' + location.latitude,
        key: 'aa05c2fc2a79403f954e51e06faf26b3'
      },
      success: r => {
        let url, headBgColor, bgColor;

        //处理实时天气情况 将天气代码转化成文字 根据天气代码设置背景图片/背景颜色
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

        r.data.HeWeather6[0].daily_forecast[0].day = '今天';
        r.data.HeWeather6[0].daily_forecast[1].day = '明天';
        r.data.HeWeather6[0].daily_forecast[2].day = '后天';


        //处理lifestyle
        r.data.HeWeather6[0].lifestyle.forEach(item => {
          item.type == 'comf' ? item.type = '舒适度' : item.type = item.type;
          item.type == 'drsg' ? item.type = '穿衣' : item.type = item.type;
          item.type == 'flu' ? item.type = '感冒' : item.type = item.type;
          item.type == 'sport' ? item.type = '运动' : item.type = item.type;
          item.type == 'trav' ? item.type = '旅游' : item.type = item.type;
          item.type == 'uv' ? item.type = '紫外线强度' : item.type = item.type;
          item.type == 'cw' ? item.type = '洗车' : item.type = item.type;
          item.type == 'air' ? item.type = '空气污染' : item.type = item.type;
        });

        this.setData({
          nowWeather: r.data.HeWeather6[0].now,
          weatherIcon: 'https://cdn.heweather.com/cond_icon/' + r.data.HeWeather6[0].now.cond_code + '.png',
          forecast: r.data.HeWeather6[0].daily_forecast,
          lifeStyle: r.data.HeWeather6[0].lifestyle,
          bgImg: '../../images/' + url + '.png',
          bgColor: bgColor,
        });

        //设置headerBar背景颜色 与天气图片保持一致
        wx.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: headBgColor
        });

        //获取空气质量AQI
        this.getAir(r.data.HeWeather6[0].basic.parent_city)

      },
      complete: () => {
        callBack && callBack()
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
  },

  getAir(city) {
    wx.request({
      url: 'https://free-api.heweather.net/s6/air/now?',
      data: {
        location: city,
        key: 'aa05c2fc2a79403f954e51e06faf26b3'
      },
      success: r => {
        //判断是否能获得控制质量数据 如果没有数据则隐藏
        if (r.data.HeWeather6[0].status == 'permission denied') {
          this.setData({
            showAir: false
          })
          return;
        }
        let site = r.data.HeWeather6[0].air_now_station;

        let flag = site.filter(it => {
          return it.air_sta == this.data.nowAddress.district
        });
        if (flag.length != 0) {
          this.setData({
            air: flag[0]
          })
        } else {
          this.setData({
            air: r.data.HeWeather6[0].air_now_city
          })
        };

        let aqi = this.data.air.aqi;
        if (aqi <= 50) {
          this._airColor = 'green'
        } else if (aqi > 50 && aqi <= 100) {
          this._airColor = 'yellow'
        } else if (aqi > 100 && aqi <= 150) {
          this._airColor = 'orange'
        } else if (aqi > 150 && aqi <= 200) {
          this._airColor = 'red'
        } else {
          this._airColor = 'purple'
        };
        this.setData({
          showAir: true,
          airColor: this._airColor
        })
      }
    })
  },

  toDaily(e) {
    let dataset = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/daily/daily?day=${dataset.day}&longitude=${this.data.location.longitude}&latitude=${this.data.location.latitude}`
    })
  },

  showDetail(e) {
    wx.showModal({
      title: e.currentTarget.dataset.title,
      content: e.currentTarget.dataset.detail,
      showCancel: false
    })
  },

  chooseAddress() {
    wx.chooseLocation({
      success: r => {
        this.setData({
          location: r
        })
        this.getNowWeather(r);
        this.getNowAddress(r)
      }
    })
  },

  onShareAppMessage() {
    return {
      title: '我写的小程序 快打开看看吧',
      path: '/pages/index/index'
    }
  }
})