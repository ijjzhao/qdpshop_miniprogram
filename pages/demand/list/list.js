// pages/demand/list/list.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const app = getApp();

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
    isCustomer: 1,
    list: [],
    page: 0,
    map: {}
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    if (options && options.isCustomer != undefined) {
      this.setData({
        isCustomer: parseInt(options.isCustomer)
      })
    }

    let that = this;
  
    if (app.globalData.token == "") {
      that.setData({
        auth: false
      })
      wx.showToast({
        title: '未授权！请在“我的”页点击头像授权!',
        icon: 'none',
        duration: 2000,
        mask: true,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {
          setTimeout(function() {
            wx.navigateBack({
              delta: -1
            })
          }, 2000)
        },
      })
    } else {
      that.setData({
        auth: true
      })
      that.getList()
    }
  },

  getList() {

    wx.showLoading({
      title: '加载中...',
      mask: true,
    })
    util.request(api.DemandList, {
      page: this.data.page + 1,
      isCustomer: this.data.isCustomer
    }).then((res) => {
      wx.hideLoading()      
      if (res.data.list == 0) {
        return
      }
      for (let i in res.data.list) {
        let item = res.data.list[i]
        item.time2show = this.getDateDiff(item.create_at)

        switch (item.status) {
          case 0:
            item.statusDesc = this.data.isCustomer ? '等待搭配师方案' : '用户已提交需求'
            if (!this.data.isCustomer) item.red = 'red'
            break
          case 1:
            let length = JSON.parse(item.plans).length
            item.statusDesc = this.data.isCustomer ? `已收到${length}个方案` : '方案已发送'
            if (this.data.isCustomer) item.red = 'red'
            break
          case 2:
            item.statusDesc = this.data.isCustomer ? '已下单' : '用户已下单'
            break
          case 3:
            item.statusDesc = this.data.isCustomer ? '已支付' : '用户已支付'
            break
        }
      }

      let list;
      if (this.data.page == 0) {
        list = res.data.list
        wx.stopPullDownRefresh()
      } else {
        list = this.data.list.concat(res.data.list);
      }
      let map = this.data.map;
      for (let key in res.data.map) {
        map[key] = res.data.map[key]
      }
      console.log(map)
      this.setData({
        list: list,
        map: map,
        page: this.data.page + 1
      })
    })
  },

  gotoDetail(e) {
    let id = e.currentTarget.dataset.id;
    let url = `/pages/demand/detail/${this.data.isCustomer ? 'user' : 'stylist'}/detail?id=${id}`;
    wx.navigateTo({
      url: url,
    })
  },

  getDateDiff(dateTimeStamp) {
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var halfamonth = day * 15;
    var month = day * 30;
    var now = new Date().getTime();
    var diffValue = now - dateTimeStamp;
    if (diffValue < 0) {
      return;
    }
    var monthC = diffValue / month;
    var weekC = diffValue / (7 * day);
    var dayC = diffValue / day;
    var hourC = diffValue / hour;
    var minC = diffValue / minute;
    let result;
    if (monthC >= 1) {
      result = "" + parseInt(monthC) + "月前";
    } else if (weekC >= 1) {
      result = "" + parseInt(weekC) + "周前";
    } else if (dayC >= 1) {
      result = "" + parseInt(dayC) + "天前";
    } else if (hourC >= 1) {
      result = "" + parseInt(hourC) + "小时前";
    } else if (minC >= 1) {
      result = "" + parseInt(minC) + "分钟前";
    } else
      result = "刚刚";
    return result;
  },
  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function() {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function() {
    this.setData({
      page: 0
    })
    this.getList();
  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function() {
    console.log('onReachBottom')
    this.getList();
  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function() {

  }
})