// pages/meirituijan/meirituijan.js
import axios from "../../util/axios.js";
import PubSub from 'pubsub-js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentList: [],
    day: "",
    month: "",
    songIndex: null
  },
  // 去song页面
  toSong(event) {
    // 路由传参，将当前的id值传递过去，拿到id值取发送请求，获取数据
    let {
      songid,
      index
    } = event.currentTarget.dataset
    wx: wx.navigateTo({
      url: '/pages/song/song?songId=' + songid,
    })
    // 拿到当前歌曲的下标，保存到状态中
    this.setData({
      songIndex: index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    // 设置日期
    let day = new Date().getDate();
    let month = new Date().getMonth() + 1;
    this.setData({
      day,
      month
    })
    // 没登录就去登录
    let cookies = wx.getStorageSync("cookies")
    // 当没有登录时就去登录页面
    if (!cookies) {
      wx.showModal({
        title: "请先登录",
        content: "该功能需要登录账号",
        cancelText: "回到首页",
        confirmText: "去登陆",
        success: ({
          confirm
        }) => {
          //可以通过data中的cancel或者confirm判断当前是点击了取消还是确定
          // console.log('success', confirm)
          if (confirm) {
            //如果用户点击了去登陆,就跳转到登录页面
            wx.redirectTo({
              url: '/pages/login/login',
            })
          } else {
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        }
      })
      return
    }
    // 获取每日推荐的歌曲
    const res = await axios("recommend/songs");
    let commentList = res.recommend.slice(0, 14);
    this.setData({
      commentList
    })
    // 接受song页面发来的消息，说要切换下一首
    PubSub.subscribe("changeSong", (msg, data) => {
      let {
        songIndex,
        commentList
      } = this.data;
      // 判断点击的是上一首还是下一首
      if (data === "pre") {
        // 第一首歌的上一首是最后一首
        songIndex === 0 ? songIndex = commentList.length - 1 : songIndex--;
      }
      if (data === "next") {
        // 最后一首歌的下一首歌是第一首歌
        songIndex === commentList.length - 1 ? songIndex = 0 : songIndex++;
      }
      // 修改下标的值
      this.setData({
        songIndex
      })
      // 通过下标的值，得到对饮给的id值
      const songId = commentList[songIndex].id;
      // 将id值传第给送页面
      PubSub.publish("songId", songId)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成/recommend/songs
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