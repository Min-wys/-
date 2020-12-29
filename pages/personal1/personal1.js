// pages/personal1/personal1.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    moveY: 0, // 移动距离
    transitionMove: ""
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
    console.log(moveY);
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
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})