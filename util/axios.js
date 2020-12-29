export default function(url, data = {}, method = "GET") {
  return new Promise((resolve, reject) => {
    // 获取cookies
    let cookiesStr = wx.getStorageSync('cookies');
    let cookies = [];
    if (cookiesStr) {
      cookies = JSON.parse(cookiesStr)
    }
    wx.request({
      url: "http://localhost:3000/" + url,
      data,
      method,
      header: {
        cookie: Array.prototype.toString.call(cookies)
      },
      success: (res) => {
        // 获取登录也面的cookies，有三个cookies，只需要一个
        if (data.isLogin) {
          // 截取cookie
          let arr = res.cookies.filter(item => item.indexOf('MUSIC_U') > -1);
          // 将cookies保存在storage中
          wx.setStorage({
            key: 'cookies',
            data: JSON.stringify(arr),
          })
        }
        resolve(res.data)
      }
    })
  })
}