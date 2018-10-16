// pages/ucenter/info/index/index.js
const util = require('../../../../utils/util.js')
const api = require('../../../../config/api.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    avatarUrl: '',
    user_id: 0,
    noFill: [0, 0, 0, 0],
    jumpIndex: [0, 2, 3, 5],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (options.id) {
      this.setData({
        user_id: options.id
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '您尚未登录',
        showCancel: false,
        success: function(e) {
          wx.navigateBack({
            delta: 1
          })
        }
      })
      return
    }

    let that = this
    wx.getUserInfo({
      success: function (res) {
        let userInfo = res.userInfo
        userInfo.avatarUrl = userInfo.avatarUrl.replace('/132', '/0');
        that.setData({
          avatarUrl: res.userInfo.avatarUrl
        })
      }
    })

  },

  getUserInfo: function(user_id) {
    if (!user_id) return
    let that = this
    util.request(api.UserInfoGet, {user_id}).then((res) => {
      let userInfo = res.data
      if (!userInfo.user_id) {
        wx.showModal({
          title: '提示',
          content: '请完善您的档案',
          showCancel: false,
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
    let index = e.currentTarget.dataset.index;
    let jumpIndex = this.data.jumpIndex[index]
    wx.navigateTo({
      url: `../update/update?index=${jumpIndex}&user_id=${this.data.user_id}`,
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
  
  }
})