App({
  onLaunch() {
    // 登录逻辑
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.globalData.userInfo = userInfo;
    }
  },
  globalData: {
    userInfo: null,
    theme: {
        primary: '#3B82F6',
        warm: '#F97316'
    }
  }
})