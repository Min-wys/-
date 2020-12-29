// pages/login/login.js
import axios from "../../util/axios.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: "",
    password: ""
  },
  inputValue(event) {
    let type = event.target.id;
    let value = event.detail.value;
    this.setData({
      [type]: value
    })
  },
  // 点击登录按钮进行验证，并将请求回来的数据保存在storage中
  async login() {
    const {
      phone,
      password,
    } = this.data;
    if (!phone) {
      wx.showToast({
        title: "请输入手机号",
        icon: "none"
      })
      return
    }
    if (!password) {
      wx.showToast({
        title: "请输入密码",
        icon: "none"
      })
      return
    }
    const result = await axios("login/cellphone", {
      phone,
      password,
      isLogin: true
    });

    if (result.code === 200) {
      wx.showToast({
        title: "登录成功即将跳转个人主页",
        icon: "none"
      })
      wx.setStorage({
        key: "userInfo",
        data: JSON.stringify(result.profile)
      })
      // switchTab才能跳转tab页面
      wx.switchTab({
        url: "/pages/personal/personal"
      })
    }

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
  onShow: function() {

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