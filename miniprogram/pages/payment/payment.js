Page({
  pay() {
    wx.showToast({
      title: '支付成功',
      icon: 'success',
      duration: 2000,
      success: () => {
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/orders/orders'
          })
        }, 2000)
      }
    })
  }
})