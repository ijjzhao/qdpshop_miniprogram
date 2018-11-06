// pages/demand/add/add.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const user = require('../../../services/user.js')

var app = getApp();

Page({

  /**
   * Page initial data
   */
  data: {
    items: [
      ['日 常', '商务拜访', '运动休闲', '约 会', '其 他'],
      ['100-300元', '300-600元', '600-1000元'],
      ['舒适就好', '要帅', '要有气质', '其他'],
    ],
    selected: [-1, -1, -1],
    other: '',
    explanIndex: -1,
    showLogin: false,
    userInfo: {},
    user_id: 0,
    mobile: ''
  },

  btnTapped(e) {
    let row = e.currentTarget.dataset.row;
    let index = e.currentTarget.dataset.index;
    let selected = this.data.selected;
    selected[row] = index
    this.setData({
      selected
    })
  },

  handleInput(e) {
    this.data.other = e.detail.value
  },

  post() {
    if (this.data.mobile) {
      return this.checkPhone();
    }
    let selected = this.data.selected;
    if (selected[0] == -1) {
      return wx.showToast({
        icon: 'none',
        duration: 2000,
        mask: true,
        title: '请选择穿衣场景',
      })
    }
    if (selected[1] == -1) {
      return wx.showToast({
        icon: 'none',
        duration: 2000,
        mask: true,
        title: '请选择预算',
      })
    }
    if (selected[1] == -1) {
      return wx.showToast({
        icon: 'none',
        duration: 2000,
        mask: true,
        title: '请选择描述',
      })
    }

    wx.showLoading({
      title: '发布中',
    })

    this.updateAvatarUrl();

    util.request(api.DemandSave, {
      form: {
        scene: selected[0],
        budget: selected[1],
        desc: selected[2],
        other: this.data.other
      }
    }, 'POST').then((res) => {

      if (res.errno == 0) {
        wx.showToast({
          icon: 'success',
          duration: 2000,
          mask: true,
          title: '发布成功',
          complete: (res) => {
            setTimeout(function() {
              wx.navigateBack({
                delta: -1
              })
              // 刷新列表
              let pages = getCurrentPages();
              let previousPage = pages[pages.length - 2];

              previousPage.setData({
                page: 0
              })

              previousPage.getList();
            }, 2000)
          }
        })
      } else {
        wx.showToast({
          icon: 'none',
          duration: 2000,
          mask: true,
          title: '发布失败',
        })
      }
    })
  },

  goLogin() {
    wx.showLoading({
      title: '登录中',
    })
    user.loginByWeixin().then(res => {
      this.setData({
        showLogin: false
      })
      this.setData({
        userInfo: res.data.userInfo,
        user_id: res.data.userInfo.id,
      });
      // wx.showModal({
      //   title: '提示',
      //   content: `您的id为${this.data.user_id}`,
      // })
      app.globalData.userInfo = res.data.userInfo;
      app.globalData.token = res.data.token;
      wx.hideLoading()
      this.checkPhone();
    }).catch((err) => {
      console.log(err)
    });
  },

  updateAvatarUrl() {

    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 获取头像
          wx.getUserInfo({
            success: function (res) {
              let userInfo = res.userInfo
              let avatarUrl = res.userInfo.avatarUrl
              util.request(api.UpdateAvatarUrl, {form:{
                avatarUrl
              }}, 'POST').then((res) => {

              })
            },
            fail: function (err) {
              console.log('getUserInfo error')
              console.error(err)
            }
          })
        } else {
          that.setData({
            showLogin: true
          })
        }
      },
      fail: function (err) {
        console.log('getSetting error')
        console.error(err)
      }
    })
  },


  showExplan(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      explanIndex: index
    })
  },

  hideExplan() {
    this.setData({
      explanIndex: -1
    })
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    try {

      if (app.globalData.userInfo.id) {
        this.setData({
          user_id: app.globalData.userInfo.id
        })
        this.checkPhone();
      } else {
        this.setData({
          showLogin: true
        })
      }

    } catch (err) {
      console.error(err)
      wx.showModal({
        title: '提示',
        content: '用户ID有误',
      })
    }


  },

  checkPhone() {
    util.request(api.BingPhoneFind, {
      userId: this.data.user_id
    }, 'POST').then( (res) => {
      if (res.data.Result.mobile == "") {
        wx.navigateTo({
          url: '/pages/ucenter/bingphone/bingphone',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      } else {
        this.setData({
          mobile: res.data.Result.mobile
        })
        return
      }
    });
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