// pages/index/components/music/index.js
import {
  indexBehav
} from "../index-behavior"

const musicMgr = wx.getBackgroundAudioManager()

Component({
  /**
   * 组件的属性列表
   */

  behaviors: [indexBehav],

  properties: {
    src: String,
    musicTitle: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    playing: false,
    play_img: '../images/player@play.png',
    pause_img: '../images/player@pause.png'
  },

  attached() {
    this.checkMusicStatus();
    this.musicSwitch()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onPlay() {
      if (!this.data.playing) {
        this.setData({
            playing: true
          }),
          musicMgr.src = this.properties.src,
          musicMgr.title = this.properties.musicTitle
      } else {
        this.setData({
            playing: false
          }),
          musicMgr.pause()
      }
    },

    checkMusicStatus() {
      if (musicMgr.paused) {
        this.setData({
          playing: false
        })
        return;
      }
      if (musicMgr.src == this.properties.src) {
        this.setData({
          playing: true
        })
      }
    },

    //统一音乐控制面板和播放按钮图片的状态
    musicSwitch() {
      musicMgr.onPlay(() => {
        this.checkMusicStatus()
      });
      musicMgr.onPause(() => {
        this.checkMusicStatus()
      });
      musicMgr.onStop(() => {
        this.checkMusicStatus()
      });
      musicMgr.onEnded(() => {
        this.checkMusicStatus()
      })
    }
  }
})