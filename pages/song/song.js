// pages/song/song.js
import axios from "../../util/axios.js";
import PubSub from "pubsub-js";
import dayjs from "dayjs";
let appInstance = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    songDetail: {},
    songId: "",
    musicUrl: "",
    isPlay: false,
    progressWidth: "", // 进度条的长度
    startTime: "00:00",
    endTime: "--:--",
  },
  // 点击上一首和下一首
  changeSong(event) {
    // id值里保存着字符串，
    const { id } = event.currentTarget;
    PubSub.publish("changeSong", id);
  },

  // 封装音乐播放函数
  musicAuto() {
    //想让背景音频自动播放,给他添加一个新的src属性和title属性
    this.backgroundAudioManager.src = this.data.musicUrl;
    this.backgroundAudioManager.title = this.data.songDetail.name;
    this.setData({
      isPlay: true,
    });
    appInstance.globalData.isPlay = true;
    appInstance.globalData.audioId = this.data.songId;
  },

  // 音频实例的方法（时间的修改）
  getAudio() {
    // 监听音乐的播放的事件
    this.backgroundAudioManager.onPlay(() => {
      this.setData({
        isPlay: true,
      });
      appInstance.globalData.isPlay = true;
    });

    // 监听音乐的暂停的事件
    this.backgroundAudioManager.onPause(() => {
      this.setData({
        isPlay: false,
      });
      appInstance.globalData.isPlay = false;
    });

    // 歌曲自动停止后，就自动的播放下一首歌
    this.backgroundAudioManager.onEnded(() => {
      PubSub.publish("changeSong", "next");
    });
  },
  getTime() {
    // 音频的更新的回调函数
    this.backgroundAudioManager.onTimeUpdate(() => {
      // 获取当前音频的总长度
      let duration = this.backgroundAudioManager.duration;
      // 获取当前的音频的播放位置
      let currentTime = this.backgroundAudioManager.currentTime;
      this.setData({
        progressWidth: Math.floor((currentTime / duration) * 100),
        startTime: dayjs(currentTime * 1000).format("mm:ss"), // 设置开始时间
      });
    });
  },

  // 点击播放当前歌曲
  async handlePlay() {
    // 获取播放歌曲的url地址进行播放，阻止多次发送请求，有了当前的地址，就不会再去发送请求
    if (!this.data.musicUrl) {
      // 获取播放地址
      await this.getSongUrl();
    }

    // true是正在播放，就关闭音乐，修改状态
    if (this.data.isPlay) {
      this.backgroundAudioManager.pause();
      this.setData({
        isPlay: false,
      });
      appInstance.globalData.isPlay = false;
      // 能走到这一步,说明音频正处于播放状态,audioId已经缓存过了
      // appInstance.globalData.audioId = this.data.songId;
    } else {
      //想让背景音频自动播放,给他添加一个新的src属性和title属性
      this.musicAuto();
    }
    // 调用音频里的方法（时间）
    this.getTime();
  },

  // 封装一个获取歌曲详情的函数
  async getSongDetail(songId) {
    songId ? songId : this.data.songId;
    // 获取歌曲的详情
    const res = await axios("song/detail", {
      ids: songId,
    });
    this.setData({
      songDetail: res.songs[0],
      songId: songId,
      endTime: dayjs(res.songs[0].dt).format("mm:ss"), // 格式化时间
    });
    // 播放歌曲页面标题
    wx.setNavigationBarTitle({
      title: res.songs[0].name,
    });
  },

  // 封装获取播放歌曲的地址函数
  async getSongUrl() {
    const res = await axios("song/url", {
      id: this.data.songId,
    });
    let { url } = res.data[0];
    this.setData({
      musicUrl: url,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    //获取全局唯一的背景音频管理器
    this.backgroundAudioManager = wx.getBackgroundAudioManager();
    // 自动播放下一首，歌曲停止和歌曲播放
    this.getAudio();

    // 发送请求
    await this.getSongDetail(options.songId);
    let { isPlay, audioId } = appInstance.globalData;
    // 判断是否是同一首歌，是否是播放状态
    if (isPlay && audioId == options.songId) {
      this.setData({
        isPlay: true,
      });
      this.getTime();
    }
    // 获取下一首和上一首歌的id值
    PubSub.subscribe("songId", async (msg, data) => {
      // 修改id，点击播放歌曲时，要用到id值
      this.setData({
        songId: data,
      });
      // 获取详情
      this.getSongDetail(data);
      // 获取播放地址
      await this.getSongUrl();
      // 音乐自动播放函数
      this.musicAuto();
      // 事件改变
      this.getAudio();
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
