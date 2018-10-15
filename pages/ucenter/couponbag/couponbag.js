// pages/ucenter/couponbag/couponbag.js
const util = require('../../../utils/util.js')
const api = require('../../../config/api.js')

Page({

  /**
   * Page initial data
   */
  data: {
    bag: {},
    coupons: [],
    showCounponBag: false
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.getBagForNewUser();
  },

  getBagForNewUser() {
    let that = this
    util.request(api.CouponBagGetForNewUser).then(res => {
      if (res.errno == 0) {
        that.setData({
          bag: res.data.bag,
          coupons: res.data.coupons,
          showCounponBag: true
        })
      }
    })
  },

  getCouponBagBtnTapped() {
    this.setData({
      showCounponBag: false
    })
    // wx.navigateTo({
    //   url: '../coupon/coupon',
    // })
    wx.redirectTo({
      url: '../coupon/coupon',
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