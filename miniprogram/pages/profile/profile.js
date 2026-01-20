Page({
  logout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success(res) {
        if (res.confirm) {
          wx.reLaunch({
            url: '/pages/login/login'
          })
        }
      }
    })
  }
})