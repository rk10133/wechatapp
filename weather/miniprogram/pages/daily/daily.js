Page({
    data: {
        day: '',
        dailyWeather: {},
        weatherIcon_d: '',
        weatherIcon_n: '',
    },

    onLoad(option) {
        this.setData({
            day: option.day,
        });
        let index;
        switch (option.day) {
            case '今天':
                index = 0
                break;
            case '明天':
                index = 1
                break;
            case '后天':
                index = 2
                break;
        };
        this.getDailyWeather(index, option.longitude, option.latitude)
    },

    getDailyWeather(index, longitude, latitude) {
        wx.request({
            url: 'https://free-api.heweather.net/s6/weather/forecast?',
            data: {
                location: longitude + ',' + latitude,
                key: 'aa05c2fc2a79403f954e51e06faf26b3'
            },
            success: r => {
                let data = r.data.HeWeather6[0].daily_forecast[index];
                this.setData({
                    dailyWeather: data,
                    weatherIcon_d: 'https://cdn.heweather.com/cond_icon/' + data.cond_code_d + '.png',
                    weatherIcon_n: 'https://cdn.heweather.com/cond_icon/' + data.cond_code_n + '.png',
                });
            },
        })
    },
})