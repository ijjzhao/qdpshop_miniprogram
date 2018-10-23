// pages/newIndex/index.js
Page({

  /**
   * Page initial data
   */
  data: {
    pics: [],
    index: 0
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let timestamp = new Date().getTime()
    this.setData({
      pics: [
        'https://img.qingdapei.net/home-introduce.png' + `?v=${timestamp}`,
        'https://img.qingdapei.net/home-whyUs.png' + `?v=${timestamp}`,
        'https://img.qingdapei.net/home-collocate.png' + `?v=${timestamp}`,
        'https://img.qingdapei.net/home-userAppraise.png' + `?v=${timestamp}`,
        'https://img.qingdapei.net/home-about.png' + `?v=${timestamp}`,
        'https://img.qingdapei.net/home-brand.png' + `?v=${timestamp}`,
      ],
    })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})