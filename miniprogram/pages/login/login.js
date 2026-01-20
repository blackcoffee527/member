Page({
  data: {
    phone: '13800138000',
    code: '1234'
  },
  onPhoneInput(e) {
    this.setData({ phone: e.detail.value });
  },
  onCodeInput(e) {
    this.setData({ code: e.detail.value });
  },
  handleLogin() {
    if (this.data.phone && this.data.code) {
      wx.switchTab({
        url: '/pages/index/index'
      });
    } else {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
    }
  }
})