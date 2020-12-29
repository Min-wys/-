// pages/video/video.js
import axios from "../../util/axios.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupList: [],
    activeId: 0,
    videoList: [],
    triggered: false,
    imageId: ""
  },
  
  // 图片被点击触发的事件
  videoImgae(event) {
    let {
      id
    } = event.currentTarget;
    this.setData({
      imageId: id
    })
    let videoContext = wx.createVideoContext(id);
    videoContext.play();
  },

  // 视频播放时触发的函数
  handlePlay(event) {

    // 获取到上一个视频的id
    let oldId = this.oldId;
    // 获取到id

    let {
      id
    } = event.currentTarget;

    // 判断有没有id值，和是不是同一个视频播放俩次
    if (oldId && id !== oldId) {
      // 停止的是上一个播放视频
      let videoContext = wx.createVideoContext(oldId);
      videoContext.pause();
    }
    // 将id值保存起来
    this.oldId = id;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  // 下拉刷新
  async fresherrefresh() {
    const res = await this.getVideoList();
    this.setData({
      triggered: false
    })
  },
  // 上拉加载
  handleScrollToLower() {
    console.log(111)
    if (this.flag) return;
    this.flag = true;
    setTimeout(async() => {
      let data = JSON.parse(JSON.stringify(this.data.videoList));
      await this.setData({
        videoList: [...this.data.videoList, ...data]
      })
      this.flag = false;
    }, 3000)

  },
  // 点击时，将当前的标签的id赋值给activeId
  async handleactive(event) {

    this.setData({
      activeId: event.target.dataset.activeid,
    })
    // 点击切换内容时，显示loading图，数据隐藏，当数据请求回来后，接在图消失
    wx.showLoading({
      title: '加载中，请稍后',
    })
    this.setData({
      videoList: []
    })
    const res = await this.getVideoList();
    wx.hideLoading()
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
    }
    // 获取标签数据
    const res = await axios("video/group/list");
    const groupList = res.data.slice(0, 14);
    this.setData({
      groupList,
      activeId: groupList[0].id
    })
    this.getVideoList();
  },
  async getVideoList() {
    // 获取视频数据
    const res2 = await axios("video/group", {
      id: this.data.activeId
    })
    this.setData({
      videoList: res2.datas
    })
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
  onShareAppMessage: function({
    from,
    target
  }) {
    if (from === "button") {
      // 每一个视频分享按钮
      const {
        title,
        coverurl
      } = target.dataset;
      return {
        title,
        path: "/pages/video/video",
        imageUrl: coverurl
      }
    } else if (from === "menu") {
      // 总的分享按钮
      return {
        title: "硅谷云音乐",
        path: "/pages/index/index",
        imageUrl: "/static/images/logo.png"
      }
    }
  }
})