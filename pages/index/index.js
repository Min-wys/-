//index.js
//获取应用实例
// const app = getApp()
import axios from "../../util/axios.js"
Page({
  data: {
    recommendList: [], // 为你精心推荐
    bannerList: [], // 轮播图数据
    // rankingList: [], // 
    // rankingList2: [], // 
    // rankingList3: [] // 
  },
  // 跳转每日推荐
  meirituijian() {
    wx.navigateTo({
      url: '/pages/meirituijan/meirituijan',
    })
  },
  onLoad: function() {
    // 获取为你精心推荐数据
    let result = axios("personalized");
    result.then((res) => {
      this.setData({
        recommendList: res.result
      })
    })

    // 获取轮播图数据
    let result2 = axios("banner?type=2");
    result2.then((res) => {
      this.setData({
        bannerList: res.banners
      })
    })
    // 排行榜数据
    const topArr = [1, 6, 8];
    let count = 0;
    let rankingList = [];
    while (count < topArr.length) {
      let result3 = axios("top/list", {
        idx: topArr[count++]
      });
      result3.then((res) => {
        let obj = {
          name: res.playlist.name,
          tracks: res.playlist.tracks
        };
        rankingList.push(obj)
        this.setData({
          rankingList
        })
      })
    }
  },
})