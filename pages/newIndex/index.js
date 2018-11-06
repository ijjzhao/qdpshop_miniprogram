// pages/newIndex/index.js
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
const app = getApp();

Page({

  /**
   * Page initial data
   */
  data: {
    pics: [],
    index: 0,
    user_id: 0
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

    if (app.globalData.userInfo.id) {
      this.setData({
        user_id: app.globalData.userInfo.id
      })
    }
  },

  bottomBtnTapped() {
    wx.navigateTo({
      url: '/pages/demand/add/add',
    })

    return

    if (this.data.user_id == 0) {
      return wx.showToast({
        title: '请先登录',
        duration: 1500,
        icon: 'none'
      })
    }
    util.request(api.UserInfoCheck, {
      user_id: this.data.user_id
    }).then((res) => {
      if (res.errno == 0 && res.data == 1) {
        wx.navigateTo({
          url: '/pages/demand/add/add',
        })
      } else {
        wx.switchTab({
          url: '/pages/ucenter/info/index/index',
        })
      }
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