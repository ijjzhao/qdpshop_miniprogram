// pages/ucenter/info/index/index.js
const util = require('../../../../utils/util.js')
const api = require('../../../../config/api.js')
const user = require('../../../../services/user.js')
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    avatarUrl: '',
    user_id: 0,
    noFill: [4, 1, 2, 4],
    jumpIndex: [0, 2, 3, 5],
    showLogin: false,

    // 以下为卡包数据
    bag: {},
    coupons: [],
    showCounponBag: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    try {
      if (options.id && options.id != '0') {
        console.log('set id')
        this.setData({
          user_id: parseInt(options.id)
        })
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

  goLogin() {
    user.loginByWeixin().then(res => {
      this.setData({
        userInfo: res.data.userInfo,
        showLogin: false
      });
      app.globalData.userInfo = res.data.userInfo;
      app.globalData.token = res.data.token;
      this.getUserInfo(res.data.userInfo.id)
    }).catch((err) => {
      console.log(err)
    });
  },

  getUserInfo: function(user_id) {
    if (!user_id) return
    let that = this    
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 获取头像
          wx.getUserInfo({
            success: function (res) {
              let userInfo = res.userInfo
              userInfo.avatarUrl = userInfo.avatarUrl.replace('/132', '/0');
              that.setData({
                avatarUrl: res.userInfo.avatarUrl
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
    

    // 获取user_info
    util.request(api.UserInfoGet, {user_id}).then((res) => {
      let userInfo = res.data
      if (!userInfo.user_id) {
        wx.showModal({
          title: '提示',
          content: '请完善您的档案',
          success: function(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: `../update/update?index=0&user_id=${that.data.user_id}`,
              })
            }
          }
        })
      } else {
        let noFill = [0, 0, 0, 0]
        let jumpIndex = [0, 2, 3, 5]

        // 第一项

        if (!userInfo.detail) {
          noFill[0]++
          jumpIndex[0] = 1
        }

        if (!userInfo.height) {
          noFill[0]++
          jumpIndex[0] = 0
        }
        if (!userInfo.weight) {
          noFill[0]++
          jumpIndex[0] = 0
        }
        if (!userInfo.age) {
          noFill[0]++
          jumpIndex[0] = 0
        }

        // 第二项
        
        if (!userInfo.color) {
          noFill[1]++
        }

        // 第三项
        if (userInfo.cut == undefined) {
          noFill[2]++
          jumpIndex[2] = 4
        }
        if (!userInfo.style) {
          noFill[2]++
          jumpIndex[2] = 3
        }

        // 第四项
        if (userInfo.pics) {
          let pics = JSON.parse(userInfo.pics)
          if (pics[0] == '') {
            noFill[3]++
            jumpIndex[3] = 6
          }
          if (pics[1] == '') {
            noFill[3]++
            jumpIndex[3] = 6
          }
        } else {
          noFill[3] += 2
          jumpIndex[3] = 6
        }



        if (userInfo.size) {
          let sizeArr = JSON.parse(userInfo.size)
          if (sizeArr[0] == -1) {
            noFill[3]++
            jumpIndex[3] = 5
          }
          if (sizeArr[1] == -1) {
            noFill[3]++
            jumpIndex[3] = 5
          }
        } else {
          noFill[3] += 2
          jumpIndex[3] = 5
        }
        
        this.setData({
          userInfo, noFill, jumpIndex
        })
      }
    })
  },

  rowTapped(e) {
    if (this.data.user_id == 0) {
      this.setData({
        showLogin: true
      })
      return
    }
    let index = e.currentTarget.dataset.index;
    let jumpIndex = this.data.jumpIndex[index]
    wx.navigateTo({
      url: `../update/update?index=${jumpIndex}&user_id=${this.data.user_id}`,
    })
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
      url: '/pages/ucenter/coupon/coupon',
    })
  },

  closeCouponBag() {
    this.setData({
      showCounponBag: false
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.user_id == 0) return
    this.getUserInfo(this.data.user_id)  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '个人档案',
      path: '/pages/ucenter/info/index/index',
      imageUrl: "/image/body.png",
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  }
})