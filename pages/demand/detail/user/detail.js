// pages/demand/detail/user/detail.js
var util = require('../../../../utils/util.js');
var api = require('../../../../config/api.js');
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
    id: 0, // demandId
    demand: {},
    planMap: {},
    myImg: ''
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    if (options.id) {
      this.setData({
        id: options.id
      })
    }
    this.getDemand()
  },

  getDemand() {
    util.request(api.DemandGet, {
      id: this.data.id
    }).then((res) => {
      let demand = res.data.demand;
      demand.plans = JSON.parse(demand.plans)
      for(let i in demand.plans) {
        this.getPlan(demand.plans[i]) 
      }
      this.setData({
        demand: demand
      })
    })
  },

  getPlan(planid) {
    // wx.showLoading({
    //   title: '加载中...',
    // })

    let that = this;
    util.request(api.PlanGet, {
      id: planid,
    })
      .then(function (res) {
        if (res.errno === 0) {
          if (res.data.length == 0) {
            wx.showModal({
              title: '提示',
              content: '未找到相关方案',
              showCancel: false
            })
          } else {
            let planDetail = res.data.plan
            let imageUrl = `${api.cdnImgUrl}${planDetail.id}.png?v=${planDetail.v}`;
            planDetail.imageUrl = imageUrl
            let planMap = that.data.planMap
            planMap[planid] = planDetail
            that.setData({
              planMap,
            });
          }
        }
        // wx.hideLoading()
      });
  },

  planTap(e) {
    let id = e.currentTarget.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: `../../../plan/detail/detail?forCustomer=1&planid=${id}&demandId=${this.data.id}`,
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