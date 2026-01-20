Page({
  data: {
    showOrders: false
  },
  toggleOrders() {
    this.setData({
      showOrders: !this.data.showOrders
    });
  }
})