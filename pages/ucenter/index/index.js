var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../services/user.js');
var app = getApp();

Page({
  data: {
    userInfo: {}
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log(app.globalData)
  },
  onReady: function() {

  },
  onShow: function() {

    let userInfo = wx.getStorageSync('userInfo');
    let token = wx.getStorageSync('token');

    // 页面显示
    if (userInfo && token) {
      app.globalData.userInfo = userInfo;
      app.globalData.token = token;
    }

    this.setData({
      userInfo: app.globalData.userInfo,
    });

  },
  onHide: function() {
    // 页面隐藏

  },
  onUnload: function() {
    // 页面关闭
  },

  goLogin() {
    user.loginByWeixin().then(res => {
      this.setData({
        userInfo: res.data.userInfo
      });
      app.globalData.userInfo = res.data.userInfo;
      app.globalData.token = res.data.token;
    }).catch((err) => {
      console.log(err)
    });
  },

  exitLogin: function() {
    wx.showModal({
      title: '',
      confirmColor: '#b4282d',
      content: '退出登录？',
      success: function(res) {
        if (res.confirm) {
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          wx.switchTab({
            url: '/pages/index/index'
          });
        }
      }
    })

  },

  cardBtnTapped: function() {
    this.addWxCard();
  },

  addWxCard() {
    let that = this;
    util.request(api.WxCardGet).then((res) => {
      if (res.errno === 0) {
        let data = res.data;
        let cardExt = {
          code: '',
          timestamp: data.timestamp,
          signature: data.signature,
          nonce_str: data.nonceStr
        }
        wx.addCard({
          cardList: [
            {
              cardId: data.card_id,
              cardExt: JSON.stringify(cardExt)
            }
          ],
          success: function (res) {
            console.log(res.cardList) // 卡券添加结果
            let cardId = res.cardList.cardId
            let encrypt_code = res.cardList.code
            that.getWxCard(cardId, encrypt_code);
          },
          fail: function (message) {
            console.log(message)
          }
        })
      }
    })
  },

  getWxCard(cardId, encrypt_code) {
    // cardId = 'pO78F1sBphJKd7tpy9-z25crV_50';
    // encrypt_code = 'IksvsPH78QozCvH3vW9v/PlPjMYMa5exUQbT0YdhcIs=';

    // Code解码接口
    util.request(api.WxCardDecrypt, {
      encrypt_code
    }, 'POST').then((res) => {
      if (res.errno == 0) {
        wx.openCard({
          cardList: [{
            cardId: cardId,
            code: res.data.code
          }],
          success: function (res) {
            console.log(res)
          }
        })
      }
    })
    
  }
})