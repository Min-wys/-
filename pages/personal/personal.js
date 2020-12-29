// pages/personal/personal.js
import axios from "../../util/axios.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    moveY: 0, // 移动距离
    transitionMove: "",
    userInfo: {},
    playList: []
  },
  toLogin() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  handleTouchstart(event) {
    // 获取初始位置
    this.start = event.touches[0].clientY;
    this.setData({
      transitionMove: ""
    })
  },
  handleTouchmove(event) {
    // 计算移动距离
    let moveY = Math.floor(event.changedTouches[0].clientY - this.start);
    if (moveY < 0) {
      moveY = 0
    }
    if (moveY > 100) {
      moveY = 100
    }
    this.setData({
      moveY
    })
  },
  handleTouchend() {
    this.setData({
      moveY: 0,
      transitionMove: "translateY,500ms"
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function() {
    // 读取登录界面的数据，数据存储在了storage
    let userInfo = wx.getStorageSync("userInfo")
    if (userInfo) {
      userInfo = JSON.parse(userInfo);
      this.setData({
        userInfo
      })
      let result = await axios("user/record", {
        type: 1,
        uid: userInfo.userId
      })
      result = result.weekData.map((item) => {
        return item.song.al.picUrl;
      })
      this.setData({
        playList: result
      })
    }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})